<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Version;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $current_version_id = Version::currentVersionId();
        $super_admin = User::create([
            'name' => config('app.super_admin.name'),
            'email' => config('app.super_admin.email'),
            'password' => \Illuminate\Support\Facades\Hash::make(config('app.super_admin.password')),
            'default' => true
        ]);
        $super_admin->versions()->attach($current_version_id);
        $super_admin->assignRole(User::SUPER_ADMIN_ROLE);
        $super_admin->markEmailAsVerified();

        $admin = User::create([
            'name' => config('app.admin.name'),
            'email' => config('app.admin.email'),
            'password' => \Illuminate\Support\Facades\Hash::make(config('app.admin.password')),
            'default' => true
        ]);
        $admin->versions()->attach($current_version_id);
        $admin->assignRole(User::ADMIN_ROLE);
        $admin->markEmailAsVerified();
    }
}
