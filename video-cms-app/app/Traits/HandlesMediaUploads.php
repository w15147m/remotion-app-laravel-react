<?php

namespace App\Traits;

use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\File;

trait HandlesMediaUploads
{
    /**
     * Helper: Create and store image in large/small folders
     */
    private function createImage($tempImage)
    {
        $imageName = 'video_item_' . time() . '_' . $tempImage['name'];
        $manager   = new ImageManager(new Driver());

        $tempPath  = public_path('uploads/temp/' . $tempImage['name']);
        $largePath = public_path('uploads/youtube/large/' . $imageName);
        $smallPath = public_path('uploads/youtube/small/' . $imageName);

        // Ensure the temporary file exists before trying to read it
        if (!File::exists($tempPath)) {
             // Handle case where temp file is missing (e.g., if uploaded file processing failed earlier)
             return null;
        }

        // Large thumbnail
        $img = $manager->read($tempPath);
        $img->scaleDown(1920);
        $img->save($largePath);

        // Small thumbnail
        $img = $manager->read($tempPath);
        $img->coverDown(400, 460);
        $img->save($smallPath);

        // Delete temp file after processing
        File::delete($tempPath);

        return $imageName;
    }

    /**
     * Helper: Delete both large & small images if they exist
     */
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
            if (File::exists($path)) {
                File::delete($path);
            }
        }
    }
}
