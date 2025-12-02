<?php
namespace App\Http\Controllers;

use App\Models\Playlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $playlists = Playlist::orderby('created_at', 'DESC')->get();

        return Inertia::render('video-admin/Playlist/PlaylistPage', [
            'playlists' => $playlists,
            'status'    => 200,
        ]);

    }

    public function create()
    {
        return Inertia::render('video-admin/Playlist/PlaylistCreate');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Enforce required and max length here
            'name'        => 'required|string|max:255|unique:playlists,name',
            'description' => 'nullable|string|max:500', // Example max length
        ]);

        Playlist::create($validated);

        // This redirect automatically carries success/error messages back to the Inertia page
        return redirect()->route('playlist.index')
            ->with('success', 'Playlist created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Using find() is cleaner for primary key lookups
        $playlist = Playlist::find($id);

        if ($playlist == null) {
            return response()->json(
                [
                    'status'  => 404,
                    'message' => 'Data not found',
                    'data'    => [],
                ]
            );
        }
        return response()->json(
            [
                'status' => 200,
                'data'   => $playlist,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */

    public function edit(Playlist $playlist)
    {
        return Inertia::render('video-admin/Playlist/PlaylistEdit', [
            'playlist' => $playlist,
            'status'    => 200,
        ]);

    }

    public function update(Request $request, Playlist $playlist)
    {
        $validated = $request->validate([
            // Note: The unique rule excludes the current playlist ID
            'name'        => 'required|string|max:255|unique:playlists,name,' . $playlist->id,
            'description' => 'nullable|string|max:500',
        ]);

        $playlist->update($validated);

        return redirect()->route('playlist.index')
            ->with('success', 'Playlist updated successfully!');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $playlist = Playlist::findOrFail($id);
        $playlist->delete();

        return redirect()->route('playlist.index')
            ->with('success', 'Playlist deleted successfully!');

    }

}
