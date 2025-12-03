<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoItem extends Model
{
    /** @use HasFactory<\Database\Factories\VideoItemFactory> */
    use HasFactory;

    protected $fillable = [
        'video_id',
        'sequence',
        'title',
        'subtitle',
        'heading',
        'icon',
        'country',
        'year',
        'year_range',
        'rank_number',
        'rank_type',
        'rank_label',
        'label',
        'detail_text',
        'media_url',
        'data',
    ];

    protected $appends = ['image_url'];
    public function getImageUrlAttribute()
    {
        if ($this->media_url == "") {
            return "";
        }
        return asset('/uploads/youtube/small/' . $this->media_url);
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sequence'    => 'integer',
        'year'        => 'integer',
        'rank_number' => 'integer',
        'data'        => 'array',
    ];

    /**
     * Get the video that owns the video item.
     */
    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}
