<?php
namespace App\Http\Controllers;

use App\Models\Video;
use App\Models\VideoItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class VideoItemController extends Controller
{
    public function index()
    {
        $video = Video::latest()->first();
        $videoItems = $video->videoItems()->orderby('sequence', 'ASC')->get();

        return Inertia::render('video-admin/videos/videoItem/VideoItemPage', [
            'video_items' => $videoItems,
            'video' => $video->only('id', 'title'),
        ]);
    }

    public function create(Request $request)
    {
        $id = $request->query('video');
        $video = Video::findOrFail($id);
        return Inertia::render('video-admin/videos/videoItem/VideoItemCreate', [
            'video' => $video->only('id', 'title'),
        ]);
    }

    public function show($id)
    {
        $videoItems = VideoItem::where('id', $id)->orderby('sequence', 'ASC')->get();
        $item = $videoItems[0];
        $video = Video::where('id', $videoItems[0]->video_id)->first();
        return Inertia::render('video-admin/videos/videoItem/VideoItemPage', [
            'video_items' => $videoItems,
            'video' => $video->only('id', 'title'),
        ]);
    }

    public function showVideoItems($id)
    {
        $video = Video::where('id', $id)->first();
        $videoItems = $video->videoItems()->orderby('sequence', 'ASC')->get();
        return Inertia::render('video-admin/videos/videoItem/VideoItemPage', [
            'video_items' => $videoItems,
            'video' => $video->only('id', 'title'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'heading' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:2100',
            'year_range' => 'nullable|string|max:50',
            'rank_number' => 'nullable|integer',
            'rank_type' => 'nullable|string|max:50',
            'rank_label' => 'nullable|string|max:100',
            'label' => 'nullable|string|max:100',
            'detail_text' => 'nullable|string',
            'media_url' => 'nullable|url|max:255',
            'video_id' => 'required|exists:videos,id',
            'data' => 'nullable|array',
        ]);

        $nextSequence = VideoItem::where('video_id', $validated['video_id'])->max('sequence');
        $validated['sequence'] = ($nextSequence ?? 0) + 1;

        $videoItem = VideoItem::create($validated);

        if ($request->gallery) {
            $imageName = $this->createImage($request->gallery);
            $videoItem->update(['media_url' => $imageName]);
        }

        return $this->showVideoItems($validated['video_id']);
    }

    public function update(Request $request, $id)
    {
        $video_item = VideoItem::findOrFail($id);
        $oldImage = $video_item->media_url;

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'heading' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:2100',
            'year_range' => 'nullable|string|max:50',
            'rank_number' => 'nullable|integer',
            'rank_type' => 'nullable|string|max:50',
            'rank_label' => 'nullable|string|max:100',
            'label' => 'nullable|string|max:100',
            'detail_text' => 'nullable|string',
            'media_url' => 'nullable|url|max:255',
            'video_id' => 'required|exists:videos,id',
            'data' => 'nullable|array',
        ]);

        // Debug: Log what we're getting
        \Log::info('Update request data:', $request->all());
        \Log::info('Validated data:', $validated);

        // Only update fields that are actually present in the request
        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($request->has($key) && $key !== 'video_id' && $key !== 'data') {
                $updateData[$key] = $value;
            }
        }
        
        \Log::info('Fields to update:', $updateData);
        
        if (!empty($updateData)) {
            $video_item->update($updateData);
        }

        if ($request->gallery) {
            $this->deleteImage($oldImage);
            $imageName = $this->createImage($request->gallery);
            $video_item->update(['media_url' => $imageName]);
        }

        return redirect('/video/Items/' . $validated['video_id']);
    }

    public function edit($id)
    {
        $videoItems = VideoItem::where('id', $id)->first();
        $video = Video::where('id', $videoItems->video_id)->first();
        return Inertia::render('video-admin/videos/videoItem/VideoItemEdit', [
            'video_item' => $videoItems,
            'video' => $video->only('id', 'title'),
        ]);
    }

    public function destroy($id)
    {
        $videoItem = VideoItem::findOrFail($id);
        $this->deleteImage($videoItem->media_url);
        $videoId = $videoItem->video_id;
        $videoItem->delete();
        return $this->showVideoItems($videoId);
    }

    private function createImage($tempImage)
    {
        $imageName = 'video_item_' . time() . '_' . $tempImage['name'];
        $manager = new ImageManager(new Driver());

        $tempPath = public_path('uploads/temp/' . $tempImage['name']);
        $largePath = public_path('uploads/youtube/large/' . $imageName);
        $smallPath = public_path('uploads/youtube/small/' . $imageName);

        $img = $manager->read($tempPath);
        $img->scaleDown(1920);
        $img->save($largePath);

        $img = $manager->read($tempPath);
        $img->coverDown(400, 460);
        $img->save($smallPath);

        return $imageName;
    }

    private function deleteImage($fileName)
    {
        if (!$fileName) {
            return;
        }

        $paths = [
            public_path('uploads/youtube/large/' . $fileName),
            public_path('uploads/youtube/small/' . $fileName),
        ];

        foreach ($paths as $path) {
            if (file_exists($path)) {
                unlink($path);
            }
        }
    }
}
