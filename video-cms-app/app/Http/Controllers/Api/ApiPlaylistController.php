<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Playlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiPlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     * GET /api/playlists
     */
    public function index()
    {
        $playlists = Playlist::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data'   => $playlists,
        ]);
    }

  
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255|unique:playlists,name',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'message' => 'Validation Failed', 'errors' => $validator->errors()], 422);
        }

        $playlist = Playlist::create($validator->validated());

        return response()->json([
            'status'  => 201,
            'message' => 'Playlist created successfully.',
            'data'    => $playlist,
        ], 201);
    }

    /**
     * Display the specified resource.
     * GET /api/playlists/{playlist}
     */
    public function show(Playlist $playlist)
    {
        // Route model binding (Playlist $playlist) handles 404 automatically for you.
        return response()->json([
            'status' => 200,
            'data'   => $playlist,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * PUT/PATCH /api/playlists/{playlist}
     */
    public function update(Request $request, Playlist $playlist)
    {
        $validator = Validator::make($request->all(), [
            // Unique rule excludes the current playlist ID
            'name'        => 'required|string|max:255|unique:playlists,name,' . $playlist->id,
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 422, 'message' => 'Validation Failed', 'errors' => $validator->errors()], 422);
        }

        $playlist->update($validator->validated());

        return response()->json([
            'status'  => 200,
            'message' => 'Playlist updated successfully.',
            'data'    => $playlist,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /api/playlists/{playlist}
     */
    public function destroy(Playlist $playlist)
    {
        // Route model binding (Playlist $playlist) handles 404 automatically for you.
        $playlist->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Playlist deleted successfully.',
        ]);
    }
}
