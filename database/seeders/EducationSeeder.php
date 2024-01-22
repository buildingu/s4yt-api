<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $education = [
            ['name' => 'High school'],
            ['name' => 'Home school'],
            ['name' => 'Currently not in school']
        ];

        DB::table('education')->insert($education);
    }
}
