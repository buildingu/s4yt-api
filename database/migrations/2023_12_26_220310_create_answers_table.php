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
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->text('response');
            $table->foreignId('question_version_id')->constrained('question_version');
            $table->foreignId('user_version_id')->constrained('user_version');
            $table->boolean('saved')->default(0);
            $table->boolean('submitted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('answers');
        Schema::enableForeignKeyConstraints();
    }
};
