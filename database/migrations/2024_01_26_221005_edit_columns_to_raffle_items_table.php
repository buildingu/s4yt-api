<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnsToRaffleItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('raffle_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_version_id');
            $table->foreignId('raffle_partner_id')->after('active')->constrained('raffle_partners');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('raffle_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('raffle_partner_id');
            $table->foreignId('user_version_id')->after('active')->constrained('user_version');
        });
    }
}
