<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Video;
use App\Models\VideoItem;
use App\Traits\HandlesMediaUploads; // ⬅️ Use the new Trait
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiVideoItemController extends Controller
{
    use HandlesMediaUploads;


    public function index()
    {
         $video      = Video::latest()->first();
        if (!$video) {
            return response()->json(['status' => 404, 'message' => 'Video not found.'], 404);
        }

        $videoItems = $video->videoItems()->orderBy('sequence', 'ASC')->get();

        return response()->json([
            'status' => 200,
            'data'   => [
                'video_items' => $videoItems,
                'video'       => $video->only('id', 'title'),
            ],
        ]);
    }

         public function videosItems($video_id)
    {
        $data = VideoItem::where('video_id',  $video_id)->orderby('created_at', 'DESC')->get();
        return response()->json(
            [
                'status' => 200,
                'data'   => $data,
            ]
        );
    }

    /**
     * Store new video item for a specific video.
     * POST /api/videos/{video}/items
     */
    public function store(Request $request, $videoId)
    {
        $validator = Validator::make($request->all(), [
            'heading'    => 'nullable|string|max:255',
            'subheading' => 'nullable|string|max:255',
            'main_value' => 'required|string|max:1000',
            'media_url'  => 'nullable|url|max:255',
            'gallery'    => 'nullable|array', // For file uploads
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'message' => 'Validation Failed', 'errors' => $validator->errors()], 422);
        }
        $validated = $validator->validated();
        $validated['video_id'] = $videoId;

        // Handle sequence number
        $nextSequence = VideoItem::where('video_id', $validated['video_id'])->max('sequence');
        $validated['sequence'] = ($nextSequence ?? 0) + 1;

        // Handle gallery image upload
        if ($request->gallery) {
            $imageName = $this->createImage($request->gallery);
            $validated['media_url'] = $imageName;
        }

        $videoItem = VideoItem::create($validated);

        return response()->json([
            'status'  => 201,
            'message' => 'Video Item created successfully.',
            'data'    => $videoItem,
        ], 201);
    }

    /**
     * Display the specified video item.
     * GET /api/video-items/{videoItem}
     */
    public function show($id)
    {
        $videoItem = VideoItem::with('video')->find($id);

        if (!$videoItem) {
            return response()->json(['status' => 404, 'message' => 'Video Item not found.'], 404);
        }

        return response()->json([
            'status' => 200,
            'data'   => $videoItem,
        ]);
    }

    /**
     * Update existing video item.
     * PUT/PATCH /api/video-items/{videoItem}
     */
    public function update(Request $request, $id)
    {
        $videoItem = VideoItem::find($id);

        if (!$videoItem) {
            return response()->json(['status' => 404, 'message' => 'Video Item not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'heading'    => 'nullable|string|max:255',
            'subheading' => 'nullable|string|max:255',
            'main_value' => 'required|string|max:1000',
            'media_url'  => 'nullable|url|max:255',
            'gallery'    => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'message' => 'Validation Failed', 'errors' => $validator->errors()], 422);
        }
        $validated = $validator->validated();

        // Store the old image name before updating
        $oldImage = $videoItem->media_url;

        // Update textual fields
        $videoItem->update($validated);

        if ($request->gallery) {
            // Delete the previous image
            $this->deleteImage($oldImage);

            // Create and assign new one
            $imageName = $this->createImage($request->gallery);
            $videoItem->update(['media_url' => $imageName]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Video Item updated successfully.',
            'data'    => $videoItem,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/video-items/{videoItem}
     */
    public function destroy($id)
    {
        $videoItem = VideoItem::find($id);

        if (!$videoItem) {
            return response()->json(['status' => 404, 'message' => 'Video Item not found.'], 404);
        }

        $this->deleteImage($videoItem->media_url);
        $videoItem->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Video Item deleted successfully.',
        ]);
    }
}
