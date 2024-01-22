<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnsToEventPartnersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('event_partners', function (Blueprint $table) {
            $table->dropColumn('short_description');
            $table->string('organization_name')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('event_partners', function (Blueprint $table) {
            $table->text('short_description')->nullable()->after('slug');
            $table->dropColumn('organization_name');
        });
    }
}
