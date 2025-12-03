<?php

use App\Http\Controllers\Api\ApiPlaylistController;
use App\Http\Controllers\Api\ApiVideoController;
use App\Http\Controllers\Api\ApiVideoItemController;
use App\Http\Controllers\Api\BulkImportVideoItemController; // ⬅️ ADD THIS
use App\Http\Controllers\Auth\logIn;
use App\Http\Controllers\TempImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [logIn::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/videos/{id}/items', [ApiVideoItemController::class, 'videosItems']);

    Route::resources([
        'playlists'   => ApiPlaylistController::class,
        'videos'      => ApiVideoController::class,
        'videoItems'  => ApiVideoItemController::class,
        'temp-images' => TempImageController::class,
    ]);
});
