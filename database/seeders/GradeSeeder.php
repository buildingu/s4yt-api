<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            ['name' => '9th grade'],
            ['name' => '10th grade'],
            ['name' => '11th grade'],
            ['name' => '12th grade']
        ];

        DB::table('grades')->insert($grades);
    }
}
