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
            'image'     => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $url = \App\Services\ImageService::process($request->file('image'), 'banners', 'banner');
            $data['image_path'] = $url;
        }

        Banner::create($data);
        return back()->with('success', 'Banner created.');
    }

    public function update(Request $request, Banner $banner)
    {
        $data = $request->validate([
            'title'     => 'string|max:100',
            'subtitle'  => 'nullable|string|max:100',
            'cta_text'  => 'nullable|string|max:50',
            'link'      => 'nullable|string|max:200',
            'is_active' => 'boolean',
            'image'     => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $url = \App\Services\ImageService::process($request->file('image'), 'banners', 'banner');
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
        $banner->delete();
        return back()->with('success', 'Banner deleted.');
    }
}
