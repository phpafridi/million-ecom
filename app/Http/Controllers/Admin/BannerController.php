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
    // Each homepage banner slot renders at a different shape — match the crop
    // preset to the actual slot so uploads aren't force-cropped into the wrong ratio.
    private function presetFor(string $position): string
    {
        return match(true) {
            $position === 'promo'          => 'banner_promo',
            $position === 'wide_bottom'    => 'banner_wide',
            str_starts_with($position, 'full') => 'banner_full',
            default                        => 'banner_sm', // small_top_1 / small_top_2
        };
    }

    public function index()
    {
        return Inertia::render('Admin/Banners/Index', [
            'banners' => Banner::orderBy('position')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'nullable|string|max:100',
            'subtitle'     => 'nullable|string|max:100',
            'cta_text'     => 'nullable|string|max:50',
            'link'         => 'nullable|string|max:200',
            'position'     => 'required|string|max:50',
            'is_active'    => 'boolean',
            'image'        => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'mobile_image' => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'video'        => 'nullable|mimes:mp4,webm,mov|max:102400',
            'video_url'    => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('banners/videos', 'uploads');
            $data['video_url']  = '/uploads/' . $path;
            $data['image_path'] = null;
        } elseif ($request->hasFile('image')) {
            $data['image_path'] = ImageService::process($request->file('image'), 'banners', $this->presetFor($data['position']));
        }
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image_path'] = ImageService::process($request->file('mobile_image'), 'banners/mobile', 'banner_sm');
        }

        unset($data['image'], $data['video'], $data['mobile_image']);
        Banner::create($data);
        return back()->with('success', 'Banner created.');
    }

    public function update(Request $request, Banner $banner)
    {
        $data = $request->validate([
            'title'        => 'nullable|string|max:100',
            'subtitle'     => 'nullable|string|max:100',
            'cta_text'     => 'nullable|string|max:50',
            'link'         => 'nullable|string|max:200',
            'is_active'    => 'nullable',
            'image'        => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'mobile_image' => 'nullable|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'video'        => 'nullable|mimes:mp4,webm,mov|max:102400',
            'video_url'    => 'nullable|string|max:500',
        ]);

        $data['is_active'] = filter_var($request->input('is_active', $banner->is_active), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('banners/videos', 'uploads');
            $data['video_url']  = '/uploads/' . $path;
            $data['image_path'] = null;
            $data['media_type'] = 'video';
        } elseif ($request->hasFile('image')) {
            $data['image_path'] = ImageService::process($request->file('image'), 'banners', $this->presetFor($banner->position));
            $data['video_url']  = null;
            $data['media_type'] = 'image';
        } elseif (!empty($data['video_url'])) {
            $data['image_path'] = null;
            $data['media_type'] = 'video';
        }
        // Only update mobile_image_path if a new file was actually uploaded
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image_path'] = ImageService::process($request->file('mobile_image'), 'banners/mobile', 'banner_sm');
        }

        // Never let null image/video fields wipe existing data
        unset($data['image'], $data['video'], $data['mobile_image']);

        $banner->update($data);
        return back()->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image_path) {
            $diskPath = \App\Services\ImageService::diskPath($banner->image_path);
            if ($diskPath) Storage::disk('uploads')->delete($diskPath);
        }
        if ($banner->video_url && str_contains($banner->video_url, '/uploads/')) {
            $diskPath = \App\Services\ImageService::diskPath($banner->video_url);
            if ($diskPath) Storage::disk('uploads')->delete($diskPath);
        }
        $banner->delete();
        return back()->with('success', 'Banner deleted.');
    }
}
