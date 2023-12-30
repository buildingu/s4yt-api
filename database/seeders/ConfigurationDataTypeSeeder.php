<?php

namespace Database\Seeders;

use App\Models\ConfigurationDataType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfigurationDataTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ConfigurationDataType::create([
            'data_type' => 'int',
            'slug' => 'integer'
        ]);

        ConfigurationDataType::create([
            'data_type' => 'time',
            'slug' => 'time'
        ]);
    }
}
