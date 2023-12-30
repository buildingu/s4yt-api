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
        Schema::create('event_partners', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->date('meet_day')->nullable();
            $table->string('meet_from', 5)->nullable();
            $table->string('meet_to', 5)->nullable();
            $table->string('meet_link')->nullable();
            $table->integer('awards_confirmed')->default(false);
            $table->string('youtube_link')->nullable();
            $table->boolean('active')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_partners');
    }
};
