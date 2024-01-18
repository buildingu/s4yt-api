<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBackupFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_backup')->default(false)->after('default');
            $table->boolean('profile_updated')->default(true)->after('is_backup');
            $table->boolean('password_updated')->default(true)->after('profile_updated');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_backup');
            $table->dropColumn('profile_updated');
            $table->dropColumn('password_updated');
        });
    }
}
