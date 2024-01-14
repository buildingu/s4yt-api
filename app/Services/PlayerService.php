<?php

namespace App\Services;

use App\Models\Coin;
use App\Models\Configuration;
use App\Models\User;
use App\Models\Player;
use App\Models\Version;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
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
            'country_id' => $data['country_id'],
            'region_id' => $data['region_id'] ?? null,
            'city_id' => $data['city_id'] ?? null
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

        // add coins to new player
        self::addCoinsToCurrentPlayer($coins, Coin::SOURCE_REGISTER, $user);
        //find referrer
        if(isset($data['referral_code'])) {
            $referrer = Player::where('referral_code', $data['referral_code'])->first();
            $player->referred_by = $referrer->id;
            $player->save();
            //add coins to referrer
            self::addCoinsToCurrentPlayer(intval(ConfigurationService::getCurrentValueByKey(Configuration::REFERRAL_COINS)), Coin::SOURCE_REFERRAL, $referrer->user);
        }
        // return player
        return $player;
    }

    private static function addCoinsToCurrentPlayer(int $coins, int $source, User $user) : void
    {
        Coin::factory()->count($coins)->create([
            'source' => $source,
            'user_version_id' => $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id
        ]);
    }

    public static function getCurrentPlayerCoins(Authenticatable $user) : int
    {
        return Coin::where('user_version_id', $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id)->count();
    }

    public static function getCurrentPlayerCoinsTable(Authenticatable $user) : array
    {
        $data_table = [];
        $coins_groups = (Coin::where('user_version_id', $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id)->get())->groupBy('source');
        foreach ($coins_groups as $key => $value) {
            $data_table[] = [
                'source' => $key == Coin::SOURCE_REGISTER ? 'register' : ($key == Coin::SOURCE_QUEST ? 'sponsor' : ($key == Coin::SOURCE_INSTAGRAM ? 'instagram' : 'referral')),
                'count' => $value->count()
            ];
        }
        return $data_table;
    }

    public static function getReferrals($player_id)
    {
        return User::whereHas('userable', function(Builder $query) use($player_id) { $query->where('referred_by', $player_id);})->select('created_at', 'name', 'email')->get();
    }

}
