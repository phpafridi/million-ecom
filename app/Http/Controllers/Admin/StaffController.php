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
        'manager' => ['label'=>'Manager','description'=>'Full access except billing','color'=>'#7C3AED','permissions'=>['orders','products','customers','categories','coupons','reviews','banners','hero_slides','chat']],
        'editor'  => ['label'=>'Editor', 'description'=>'Manage products and content','color'=>'#2563EB','permissions'=>['products','categories','banners','hero_slides','pages']],
        'support' => ['label'=>'Support','description'=>'Handle orders and tickets', 'color'=>'#059669','permissions'=>['orders','customers','support_tickets','chat']],
        'viewer'  => ['label'=>'Viewer', 'description'=>'Read-only dashboard',      'color'=>'#6B7280','permissions'=>['dashboard']],
    ];

    public function index()
    {
        $staff = User::where(function($q) { $q->where('role','admin')->orWhere('is_staff',true); })
            ->orderBy('created_at')->get()
            ->map(fn($u) => ['id'=>$u->id,'name'=>$u->name,'email'=>$u->email,'role'=>$u->role,'staff_role'=>$u->staff_role,'is_staff'=>(bool)$u->is_staff,'is_active'=>(bool)($u->is_active??true),'last_login_at'=>$u->last_login_at,'created_at'=>$u->created_at,'permissions'=>$u->permissions??[]]);

        return Inertia::render('Admin/Staff/Index', ['staff'=>$staff,'roles'=>self::$roles,'totalStaff'=>$staff->count()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name'=>'required|string|max:100','email'=>'required|email|unique:users,email','password'=>'required|min:8','staff_role'=>'required|in:manager,editor,support,viewer']);
        $roleConfig = self::$roles[$data['staff_role']];
        User::create(['name'=>$data['name'],'email'=>$data['email'],'password'=>Hash::make($data['password']),'role'=>'staff','is_staff'=>true,'staff_role'=>$data['staff_role'],'permissions'=>$roleConfig['permissions'],'is_active'=>true]);
        return back()->with('success', "Staff member {$data['name']} created as {$roleConfig['label']}.");
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate(['name'=>'sometimes|string|max:100','staff_role'=>'sometimes|in:manager,editor,support,viewer','is_active'=>'sometimes|boolean','password'=>'sometimes|nullable|string|min:8','permissions'=>'sometimes|array']);
        if (!empty($data['password'])) { $data['password'] = Hash::make($data['password']); } else { unset($data['password']); }
        if (isset($data['staff_role'])) { $data['permissions'] = self::$roles[$data['staff_role']]['permissions']; }
        $user->update($data);
        return back()->with('success', "{$user->name} updated.");
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin' && User::where('role','admin')->count() <= 1) return back()->withErrors(['error'=>'Cannot delete the last admin.']);
        $user->delete();
        return back()->with('success', 'Staff member removed.');
    }
}
