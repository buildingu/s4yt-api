<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::create(['name' => User::SUPER_ADMIN_ROLE]);
        Role::create(['name' => User::ADMIN_ROLE]);
        Role::create(['name' => User::EVENT_PARTNER_ROLE]);
        Role::create(['name' => User::EVENT_PARTNER_GUEST_ROLE]);
        Role::create(['name' => User::RAFFLE_PARTNER_ROLE]);
        Role::create(['name' => User::SPONSOR_PARTNER_ROLE]);
        Role::create(['name' => User::PLAYER_ROLE]);
        Role::create(['name' => User::BU_PLAYER_ROLE]);
    }
}
