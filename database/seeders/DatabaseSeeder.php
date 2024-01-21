<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            VersionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            ConfigurationDataTypeSeeder::class,
            ConfigurationSeeder::class,
            EducationSeeder::class,
            GradeSeeder::class,
            BackupSeeder::class
        ]);
    }
}
