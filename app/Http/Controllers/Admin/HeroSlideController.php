<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroSlideController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/HeroSlides/Index', [
            'slides' => HeroSlide::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'         => 'nullable|string',
            'subtitle'      => 'nullable|string',
            'description'   => 'nullable|string',
            'cta_text'      => 'nullable|string',
            'cta_url'       => 'nullable|string',
            'discount_pct'  => 'integer|min:0|max:99',
            'price'         => 'nullable|string',
            'compare_price' => 'nullable|string',
            'is_active'     => 'boolean',
        ]);

        $data['sort_order'] = HeroSlide::max('sort_order') + 1;

        if ($request->hasFile('image')) {
            $data['image_path'] = \App\Services\ImageService::process($request->file('image'), 'banners', 'hero');
        } else {
            $data['image_path'] = null;
        }

        HeroSlide::create($data);
        return back()->with('success', 'Slide created.');
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $data = $request->validate([
            'title'         => 'string',
            'subtitle'      => 'string',
            'description'   => 'string',
            'cta_text'      => 'string',
            'cta_url'       => 'string',
            'discount_pct'  => 'integer|min:0|max:99',
            'price'         => 'nullable|string',
            'compare_price' => 'nullable|string',
            'is_active'     => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($heroSlide->image_path) Storage::delete($heroSlide->image_path);
            $data['image_path'] = \App\Services\ImageService::process($request->file('image'), 'banners', 'hero');
        }

        $heroSlide->update($data);
        return back()->with('success', 'Slide updated.');
    }

    public function destroy(HeroSlide $heroSlide)
    {
        if ($heroSlide->image_path) Storage::delete($heroSlide->image_path);
        $heroSlide->delete();
        return back()->with('success', 'Slide deleted.');
    }

    public function reorder(Request $request)
    {
        foreach ($request->order as $i => $id) {
            HeroSlide::where('id', $id)->update(['sort_order' => $i]);
        }
        return response()->json(['ok' => true]);
    }
}
