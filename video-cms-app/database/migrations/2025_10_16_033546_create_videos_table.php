<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();

            // Core Video Data
            $table->string('title')->comment('Title of the final video (e.g., "Top 10 Cities").');
            $table->string('template_name', 50)->comment('Which React component template to use for rendering.');
            $table->enum('type', ['short', 'full'])
                ->comment('The intended output format: short video or full-length video.');
            $table->foreignId('playlist_id')
                ->nullable()               // Allow videos not yet assigned to a playlist
                ->constrained('playlists') // Assumes the table is named 'playlists'
                ->onDelete('set null')     // If a playlist is deleted, videos remain but their playlist_id is set to null
                ->comment('Foreign key to the playlists table. NULLable for videos not in a playlist.');
            // Status and Output Tracking
            $table->string('status', 20)->default('pending')->comment('pending, processing, completed, failed.');
            $table->string('output_path')->nullable()->comment('File path to the generated MP4 file.');

            // Optional foreign key to a user table if you have authentication
            // $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
