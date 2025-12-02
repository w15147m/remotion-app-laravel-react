<?php
namespace App\Jobs;

use App\Models\Video;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\URL;

class GenerateVideoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $video;

    public function __construct(Video $video)
    {
        $this->video = $video->load('videoItems');
    }

    public function handle(): void
    {
        $video = $this->video;

        $tempDataDir = storage_path('app/temp/remotion-data');
        File::ensureDirectoryExists($tempDataDir);

        $dataFileName = "video_{$video->id}_data.json";
        $dataFilePath = "{$tempDataDir}/{$dataFileName}";

        $outputFileName = "{$video->id}_{$video->template_name}.mp4";
        $outputDir = storage_path('app/public/videos');
        $outputPath = "{$outputDir}/{$outputFileName}";
        File::ensureDirectoryExists($outputDir);

        $data = [
            'video_title' => $video->title,
            'template_name' => $video->template_name,
            'items' => $video->videoItems->map(function ($item) {
                $fullUrl = URL::to('/uploads/youtube/large/' . $item->media_url);

                return array_merge($item->only(['heading', 'subheading', 'main_value', 'detail_text']), [
                    'media_url' => $fullUrl,
                ]);
            })->toArray(),
        ];
        File::put($dataFilePath, json_encode($data, JSON_PRETTY_PRINT));

        $remotionProjectRoot = base_path('../remotion-renderer');

        $nvmScriptPath = '/home/pc/.nvm/nvm.sh';

        $escapedRoot = escapeshellarg($remotionProjectRoot);

        $dataJson = json_encode(['data_path' => $dataFilePath]);
        $escapedProps = escapeshellarg($dataJson);
        $escapedOutput = escapeshellarg($outputPath);

        // 🚀 THE FINAL FIX: Using the dot command (.) instead of 'source' for /bin/sh compatibility.
        $fullCommand = ". {$nvmScriptPath} && cd {$escapedRoot} && npx remotion render src/index.tsx {$video->template_name} {$escapedOutput} --props {$escapedProps} --parallelism=1";

        \Log::info("Remotion Command: " . $fullCommand);

        $process = Process::timeout(3600)->run($fullCommand);

        File::delete($dataFilePath);

        if ($process->successful()) {
            $video->update([
                'status' => 'completed',
                'output_path' => 'videos/' . $outputFileName,
            ]);
        } else {
            \Log::error("Remotion render failed for Video ID: {$video->id}. Output: " . $process->errorOutput());
            $video->update(['status' => 'failed']);
            throw new \Exception("Video rendering failed for ID: {$video->id}. Check logs for details.");
        }
    }
}
