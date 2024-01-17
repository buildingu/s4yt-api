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
        Schema::create('award_winners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_version_id')->constrained('user_version');
            $table->foreignId('award_version_id')->constrained('award_version');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('award_winners');
    }
};
