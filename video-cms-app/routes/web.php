<?php

use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\TempImageController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/video/{video}/generate', [VideoController::class, 'generate'])->name('video.generate');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('test', function () {
        return Inertia::render('test');
    })->name('test');
    Route::get('video/Items/{id}', [VideoItemController::class, 'showVideoItems']);
    Route::get('playlist', function () {
        return Inertia::render('video-admin/Playlist/PlaylistPage');
    })->name('playlist');

    Route::resources([
        'playlist'   => PlaylistController::class,
        'video'      => VideoController::class,
        'videoItem'  => VideoItemController::class,
        'temp-image' => TempImageController::class,

    ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

//   GET|HEAD        playlist ....................*.......... playlist.index › PlaylistController@index
//   POST            playlist ....................*.......... playlist.store › PlaylistController@store
//   GET|HEAD        playlist/create .............*........ playlist.create › PlaylistController@create
//   GET|HEAD        playlist/{play_list} ........*............ playlist.show › PlaylistController@show
//   PUT|PATCH       playlist/{play_list} ........*........ playlist.update › PlaylistController@update
//   DELETE          playlist/{play_list} ........*...... playlist.destroy › PlaylistController@destroy
//   GET|HEAD        playlist/{play_list}/edit ...*............ playlist.edit › PlaylistController@edit
//   G  GET|HEAD     video ........................*................. video.index › VideoController@index
//   POST            video ........................*................. video.store › VideoController@store
//   GET|HEAD        videoItem ...................*........ videoItem.index › VideoItemController@index
//   POST            videoItem ...................*........ videoItem.store › VideoItemController@store
//   GET|HEAD        videoItem/create ............*...... videoItem.create › VideoItemController@create
//   GET|HEAD        videoItem/{video_item} ......*.......... videoItem.show › VideoItemController@show
//   PUT|PATCH       videoItem/{video_item} ......*...... videoItem.update › VideoItemController@update
//   DELETE          videoItem/{video_item} ......*.... videoItem.destroy › VideoItemController@destroy
//   GET|HEAD        videoItem/{video_item}/edit .*.......... videoItem.edit › VideoItemController@edit
//   GET|HEAD        video/create .................*............... video.create › VideoController@create
//   GET|HEAD        video/{video} ................*................... video.show › VideoController@show
//   PUT|PATCH       video/{video} ................*............... video.update › VideoController@update
//   DELETE          video/{video} ................*............. video.destroy › VideoController@destroy
//   GET|HEAD        video/{video}/edit ...........*................... video.edit › VideoController@edit

http: //127.0.0.1:8000/videoItem?video=3"
