<?php

namespace Database\Seeders;

use App\Models\Version;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VersionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $is_production = env('APP_ENV') != 'production';
        $date = Carbon::now();
        Version::create([
            'year' => $is_production ? '2024' : $date->year,
            'active' => true
        ]);
    }
}
