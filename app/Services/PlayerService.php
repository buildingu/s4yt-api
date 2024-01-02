<?php

namespace App\Services;

use App\Models\Coin;
use App\Models\User;
use App\Models\Player;
use App\Models\Version;
use Illuminate\Support\Facades\Hash;

class PlayerService
{
    public static function addPlayer(array $data, int $coins, bool $admin = false): Player
    {
        $current_version_id = Version::currentVersionId();

        // user create
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $admin ? Hash::make(config('app.default_pass')) : Hash::make($data['password']),
            'default' => false
        ]);
        // attach the user to the current version
        $user->versions()->attach($current_version_id);

        // player create
        $player = Player::create([
            'education_id' => $data['education_id'],
            'grade_id' => $data['grade_id'],
            'city_id' => $data['city_id']
        ]);
        $player->school =  $data['school'] ?? null;
        $player->save();
        $player->user()->save($user);

        // assign role
        if($admin) {
            $user->assignRole($data["role"]);
        } else {
            $user->assignRole(User::PLAYER_ROLE);
        }
        // add coins
        self::addCoinsToCurrentPlayer($coins, Coin::SOURCE_REGISTER, $user);
        // return player
        return $player;
    }

    private static function addCoinsToCurrentPlayer(int $coins, int $source, User $user) : void
    {
        Coin::factory()->count($coins)->make([
            'source' => $source,
            'user_version_id' => $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id
        ]);
    }

}
