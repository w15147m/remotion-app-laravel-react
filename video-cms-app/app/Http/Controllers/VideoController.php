<?php
namespace App\Http\Controllers;

use App\Jobs\GenerateVideoJob;
use App\Models\Playlist;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VideoController extends Controller
{





    public function index()
    {
        $videos = Video::with('playlist')->orderby('created_at', 'DESC')->get();
        return Inertia::render('video-admin/videos/VideoList/VideoListPage', [
            'videos' => $videos->map(function ($video) {
                return [
                    'id'            => $video->id,
                    'title'         => $video->title,
                    'template_name' => $video->template_name,
                    'type'          => $video->type,
                    'status'        => $video->status,
                    'playlist_name' => $video->playlist?->name,
                    'output_path'   => $video->output_path,
                ];
            }),
            'status' => 200,
        ]);
    }

    public function create()
    {
        $playlists = Playlist::select('id', 'name')->orderby('name', 'ASC')->get();

        return Inertia::render('video-admin/videos/VideoList/VideoCreate', [
            'playlists' => $playlists,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255|unique:videos,title',
            'template_name' => 'required|string|max:50',
            'type'          => ['required', Rule::in(['short', 'full'])],
            'playlist_id'   => 'nullable|exists:playlists,id',
        ]);

        // Ensure status is set to 'pending' on creation
        $validated['status'] = 'pending';

        Video::create($validated);

        return redirect()->route('video.index')
            ->with('success', 'Video created successfully!');
    }

    // 🆕 New: Show the form for editing the specified resource.
    public function edit(Video $video)
    {
        $playlists = Playlist::select('id', 'name')->orderby('name', 'ASC')->get();

        return Inertia::render('video-admin/videos/VideoList/VideoEdit', [
            'video'     => $video,
            'playlists' => $playlists,
        ]);
    }

    // 🆕 New: Update the specified resource in storage.
    public function update(Request $request, Video $video)
    {
        $validated = $request->validate([
            // Note: The unique rule excludes the current video ID
            'title'         => 'required|string|max:255|unique:videos,title,' . $video->id,
            'template_name' => 'required|string|max:50',
            'type'          => ['required', Rule::in(['short', 'full'])],
            'playlist_id'   => 'nullable|exists:playlists,id',
            // Allow status update if needed, but not required by the form
            'status'        => ['sometimes', 'required', Rule::in(['pending', 'processing', 'completed', 'failed'])],
        ]);

        $video->update($validated);

        return redirect()->route('video.index')
            ->with('success', 'Video updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     * The `destroy` method remains the same as your provided file.
     */
    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();

        return redirect()->route('video.index')
            ->with('success', 'Video deleted successfully!');
    }
}
