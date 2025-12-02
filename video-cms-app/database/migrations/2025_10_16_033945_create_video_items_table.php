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
       Schema::create('video_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->integer('sequence');
            
            // Main content fields
            $table->string('title', 255)->nullable();
            $table->string('subtitle', 255)->nullable();
            $table->string('heading', 255)->nullable();
            $table->string('icon', 10)->nullable()->comment('Emoji or icon character');
            $table->string('country', 100)->nullable();
            
            // Year/Date fields
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('year_range', 50)->nullable()->comment('e.g., "1956-1977"');
            
            // Ranking fields
            $table->integer('rank_number')->nullable();
            $table->string('rank_type', 50)->nullable();
            $table->string('rank_label', 100)->nullable()->comment('Label for ranking (e.g., "Goals")');
            $table->string('label', 100)->nullable()->comment('General label field');
            
            // Content fields
            $table->text('detail_text')->nullable();
            $table->string('media_url')->nullable();
            
            // Type field for short/video
            $table->enum('type', ['short', 'video'])->default('short')->comment('Item type: short or video');
            
            // Flexible data storage
            $table->json('data')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_items');
    }
};
