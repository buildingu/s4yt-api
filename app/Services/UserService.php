<?php

namespace App\Services;

use App\Models\User;
use App\Models\Version;
use App\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Method add user record.
     * @param array $data
     * @param bool $admin
     * @return User
     */
    public static function addUser(array $data, bool $admin) : User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $admin ? Hash::make(config('app.default_pass')) : Hash::make($data['password']),
            'default' => false,
            'is_backup' => $data['is_backup'] ?? false,
            'profile_updated' => $data['profile_updated'] ?? true,
            'password_updated' => $data['password_updated'] ?? true,
        ]);
        // attach the user to the current version
        $user->versions()->attach(Version::currentVersionId());

        return $user;
    }

    public static function updateUser(array $data, Authenticatable $user, bool $email_update) : Authenticatable
    {
        // update user
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->email_verified_at = $email_update ? null : $user->email_verified_at;
        $user->save();
        return $user;
    }
}
