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
            'data_type' => 'integer',
            'slug' => 'integer'
        ]);

        ConfigurationDataType::create([
            'data_type' => 'date',
            'slug' => 'date'
        ]);
    }
}
