<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;
use App\Notifications\VerifyEmail;
use App\Services\PlayerService;
use App\Models\Version;
use App\Models\User;

class UserService
{
    public function create(array $data){
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->assignRole(User::PLAYER_ROLE);
        $user->versions()->attach(Version::currentVersion());
        $user->notify(new VerifyEmail());

        (new PlayerService())->create($data['player'],$user);

        return $user;
    }

    public function update(array $data, User $user){
        $user->fill(
            Arr::except($data,['player','id','_method'])
        )->save();

        if(isset($data['player'])){
            (new PlayerService())->update($data['player'],$user->userable);
        }

        return $user;
    }
}
