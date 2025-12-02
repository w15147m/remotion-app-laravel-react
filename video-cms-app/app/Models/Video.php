<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    /** @use HasFactory<\Database\Factories\VideoFactory> */
    use HasFactory;
        protected $fillable = [
        'title',
        'template_name',
        'type',
        'playlist_id',
        'status',
        'output_path',
    ];
     public function playlist()
    {

        return $this->belongsTo(Playlist::class);

    }
      public function videoItems()
    {
        return $this->hasMany(VideoItem::class);
    }
}
