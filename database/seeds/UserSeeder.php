<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $super_admin = User::create([
            'name' => config('app.super_admin.name'),
            'email' => config('app.super_admin.email'),
            'password' => \Illuminate\Support\Facades\Hash::make(config('app.super_admin.password'))
        ]);
        $super_admin->assignRole(User::SUPER_ADMIN_ROLE);
        $super_admin->markEmailAsVerified();

        $admin = User::create([
            'name' => config('app.admin.name'),
            'email' => config('app.admin.email'),
            'password' => \Illuminate\Support\Facades\Hash::make(config('app.admin.password'))
        ]);
        $admin->assignRole(User::ADMIN_ROLE);
        $admin->markEmailAsVerified();
    }
}
