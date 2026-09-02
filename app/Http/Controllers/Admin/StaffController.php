<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public static array $roles = [
        'manager' => ['label'=>'Manager','description'=>'Full access except billing','color'=>'#7C3AED','permissions'=>['orders','products','customers','categories','coupons','reviews','banners','hero_slides','chat','support']],
        'editor'  => ['label'=>'Editor', 'description'=>'Products and content only',  'color'=>'#2563EB','permissions'=>['products','categories','banners','hero_slides','pages']],
        'support' => ['label'=>'Support','description'=>'Orders and tickets',          'color'=>'#059669','permissions'=>['orders','customers','support_tickets','chat']],
        'viewer'  => ['label'=>'Viewer', 'description'=>'Read-only dashboard',         'color'=>'#6B7280','permissions'=>['dashboard']],
    ];

    public function index()
    {
        $staff = User::where(fn($q) => $q->where('role','admin')->orWhere('role','staff')->orWhere('is_staff',true))
            ->orderBy('created_at')->get()
            ->map(fn($u) => ['id'=>$u->id,'name'=>$u->name,'email'=>$u->email,'role'=>$u->role,'staff_role'=>$u->staff_role,'is_staff'=>(bool)$u->is_staff,'is_active'=>(bool)($u->is_active??true),'last_login_at'=>$u->last_login_at,'created_at'=>$u->created_at,'permissions'=>$u->permissions??[]]);
        return Inertia::render('Admin/Staff/Index', ['staff'=>$staff,'roles'=>self::$roles]);
    }

    // Valid permission keys — matches AdminMiddleware's map and the
    // frontend's PERMISSION_OPTIONS list exactly, so validation can't be
    // bypassed with an arbitrary string that happens to match nothing.
    public static array $validPermissions = ['dashboard','orders','orders_lookup','products','customers','categories','coupons','reviews',
        'email_campaigns','support_tickets','hero_slides','banners','pages','returns','chat','can_delete'];

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'=>'required|string|max:100','email'=>'required|email|unique:users,email','password'=>'required|min:8',
            'staff_role'=>'required|in:manager,editor,support,viewer',
            // Custom, hand-picked permissions — falls back to the role's
            // default set if the admin didn't customize anything. Previously
            // there was no way to give a staff member any combination other
            // than the 4 fixed presets.
            'permissions'=>'nullable|array','permissions.*'=>'in:'.implode(',', self::$validPermissions),
        ]);
        $permissions = $data['permissions'] ?? self::$roles[$data['staff_role']]['permissions'];
        User::create(['name'=>$data['name'],'email'=>$data['email'],'password'=>Hash::make($data['password']),'role'=>'staff','is_staff'=>true,'staff_role'=>$data['staff_role'],'permissions'=>$permissions,'is_active'=>true]);
        return back()->with('success', $data['name'] . ' added as ' . self::$roles[$data['staff_role']]['label'] . '.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'=>'sometimes|string|max:100','staff_role'=>'sometimes|in:manager,editor,support,viewer','is_active'=>'sometimes|boolean','password'=>'sometimes|nullable|string|min:8',
            'permissions'=>'nullable|array','permissions.*'=>'in:'.implode(',', self::$validPermissions),
        ]);
        $passwordChanged = !empty($data['password']);
        if ($passwordChanged) { $data['password'] = Hash::make($data['password']); } else { unset($data['password']); }
        // Previously always overwrote permissions with the role's fixed
        // list whenever staff_role was present in the request — meaning
        // any custom checkbox selection from the edit form could never
        // actually persist, since this line silently replaced it every
        // single save. Now only falls back to the role default when the
        // admin genuinely didn't send a custom permissions array at all.
        if (array_key_exists('permissions', $data)) {
            // explicit array (possibly empty) sent — respect it as-is
        } elseif (isset($data['staff_role'])) {
            $data['permissions'] = self::$roles[$data['staff_role']]['permissions'];
        }
        $user->update($data);
        // Lets a staff member notice an unauthorized password reset — no
        // notification existed at all before.
        if ($passwordChanged) {
            \App\Jobs\NotifyPasswordChanged::dispatch($user->email, $user->name);
        }
        return back()->with('success', $user->name . ' updated.');
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin' && User::where('role','admin')->count() <= 1) return back()->withErrors(['error'=>'Cannot delete last admin.']);
        $user->delete();
        return back()->with('success', 'Staff member removed.');
    }
}
