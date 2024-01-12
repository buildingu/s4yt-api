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
            'year' => $is_production ? '2023' : $date->year,
            'month' => $is_production ? '02' : $date->month,
            'day_start' => $is_production ? '02' : $date->day,
            'day_end' => $is_production ? '09' : $date->day + 7,
            'active' => true
        ]);
    }
}
