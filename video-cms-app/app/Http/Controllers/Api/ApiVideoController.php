<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class ApiVideoController extends Controller // Renamed to ApiVideoController to avoid conflict
{
    /**
     * Display a listing of the resource.
     * GET /api/videos
     */
    public function index()
    {
        $videos = Video::with('playlist')->orderby('created_at', 'DESC')->get();

        // Map the videos to include playlist_name, similar to the Inertia version
        $data = $videos->map(function ($video) {
            return [
                'id'            => $video->id,
                'title'         => $video->title,
                'template_name' => $video->template_name,
                'type'          => $video->type,
                'status'        => $video->status,
                'playlist_name' => $video->playlist?->name,
                'output_path'   => $video->output_path,
                'created_at'    => $video->created_at,
            ];
        });

        return response()->json(
            [
                'status' => 200,
                'data'   => $data,
            ]
        );
    }





    /**
     * Store a newly created resource in storage.
     * POST /api/videos
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'         => 'required|string|max:255|unique:videos,title',
            'template_name' => 'required|string|max:50',
            'type'          => ['required', Rule::in(['short', 'full'])],
            'playlist_id'   => 'nullable|exists:playlists,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        // Ensure status is set to 'pending' on creation
        $validated['status'] = 'pending';

        $video = Video::create($validated);

        return response()->json([
             'message' => 'Video created successfully',
            "data" => $video,
        ], 201); // 201 Created status
    }

    /**
     * Display the specified resource.
     * GET /api/videos/{video}
     */
    public function show($id)
    {
        $video = Video::with('playlist')->find($id);

        if (!$video) {
            return response()->json(
                [
                    'status'  => 404,
                    'massage' => 'Video not found',
                    'data'    => [],
                ], 404
            );
        }

        // Return a structured response, similar to index, but includes all fields
        $data = [
            'id'            => $video->id,
            'title'         => $video->title,
            'template_name' => $video->template_name,
            'type'          => $video->type,
            'status'        => $video->status,
            'playlist_id'   => $video->playlist_id,
            'playlist_name' => $video->playlist?->name,
            'output_path'   => $video->output_path,
            'created_at'    => $video->created_at,
            'updated_at'    => $video->updated_at,
        ];


        return response()->json(
            [
                'status' => 200,
                'data'   => $data,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /api/videos/{video}
     */
    public function update(Request $request, $id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(
                [
                    'status'  => 404,
                    'massage' => 'Video not found',
                    'data'    => [],
                ], 404
            );
        }

        $validator = Validator::make($request->all(), [
            // Note: The unique rule excludes the current video ID
            'title'         => 'sometimes|required|string|max:255|unique:videos,title,' . $video->id,
            'template_name' => 'sometimes|required|string|max:50',
            'type'          => ['sometimes', 'required', Rule::in(['short', 'full'])],
            'playlist_id'   => 'nullable|exists:playlists,id',
            'status'        => ['sometimes', 'required', Rule::in(['pending', 'processing', 'completed', 'failed'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $video->update($validator->validated());

        return response()->json([
            'message' => 'Video updated successfully',
            "data" => $video,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/videos/{video}
     */
    public function destroy($id)
    {
        $video = Video::find($id);

        if (!$video) {
            return response()->json(
                [
                    'status'  => 404,
                    'massage' => 'Video not found',
                    'data'    => [],
                ], 404
            );
        }

        $video->delete();

        return response()->json([
            'message' => 'Video deleted successfully',
        ], 200);
    }

    /*
    * The create and edit methods are typically not needed for a RESTful API
    * as they only serve to render views with data for forms.
    */
}
