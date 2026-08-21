<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Banners/Index', [
            'banners' => Banner::orderBy('position')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'     => 'required|string|max:100',
            'subtitle'  => 'nullable|string|max:100',
            'cta_text'  => 'nullable|string|max:50',
            'link'      => 'nullable|string|max:200',
            'position'  => 'required|string|max:50',
            'is_active' => 'boolean',
            'image'     => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'video'     => 'nullable|mimes:mp4,webm,mov|max:102400',
            'video_url' => 'nullable|string|max:500',
        ]);

        // Video file upload takes priority
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('banners/videos', 'uploads');
            $data['video_url']  = asset('uploads/' . $path);
            $data['image_path'] = null;
        } elseif ($request->hasFile('image')) {
            $url = ImageService::process($request->file('image'), 'banners', 'banner');
            $data['image_path'] = $url;
        }
        // video_url string (link) is already in $data from validation

        Banner::create($data);
        return back()->with('success', 'Banner created.');
    }

    public function update(Request $request, Banner $banner)
    {
        $data = $request->validate([
            'title'     => 'nullable|string|max:100',
            'subtitle'  => 'nullable|string|max:100',
            'cta_text'  => 'nullable|string|max:50',
            'link'      => 'nullable|string|max:200',
            'is_active' => 'boolean',
            'image'     => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'video'     => 'nullable|mimes:mp4,webm,mov|max:102400',
            'video_url' => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('banners/videos', 'uploads');
            $data['video_url']  = asset('uploads/' . $path);
            $data['image_path'] = null;
        } elseif ($request->hasFile('image')) {
            $url = ImageService::process($request->file('image'), 'banners', 'banner');
            $data['image_path'] = $url;
        }

        $banner->update($data);
        return back()->with('success', 'Banner updated.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image_path && !str_starts_with($banner->image_path, 'http')) {
            Storage::disk('uploads')->delete($banner->image_path);
        }
        if ($banner->video_url && str_contains($banner->video_url, '/uploads/')) {
            $path = str_replace(asset('uploads/'), '', $banner->video_url);
            Storage::disk('uploads')->delete($path);
        }
        $banner->delete();
        return back()->with('success', 'Banner deleted.');
    }
}
