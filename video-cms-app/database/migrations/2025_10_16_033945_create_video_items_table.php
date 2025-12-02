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
            $table->string('title', 255)->nullable();
            $table->string('heading', 255)->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->integer('rank_number')->nullable();
            $table->string('rank_type', 50)->nullable();
            $table->text('detail_text')->nullable();
            $table->string('media_url')->nullable();
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
