<?php

namespace App\Services;

use App\Models\Coin;
use App\Models\Configuration;
use App\Models\User;
use App\Models\Player;
use App\Models\Version;
use App\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class PlayerService
{
    /**
     * Method add user and player record dynamically.
     * @param array $data
     * @param int $coins
     * @param bool $partial
     * @param bool $admin
     * @return User
     */
    public static function addPlayer(array $data, int $coins, bool $partial = false, bool $admin = false): User
    {
        // user create
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
        // partial conditional
        if(!$partial) {
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
            //add coins to referrer
            if(isset($data['referral_code'])) {
                $referrer = Player::where('referral_code', $data['referral_code'])->first();
                $player->referred_by = $referrer->id;
                $player->save();
                self::addCoinsToCurrentPlayer(intval(ConfigurationService::getCurrentValueByKey(Configuration::REFERRAL_COINS)), Coin::SOURCE_REFERRAL, $referrer->user);
            }
        }
        // assign roles
        $admin ? $user->assignRole($data["role"]) : $user->assignRole(User::PLAYER_ROLE);
        // add coins to new player
        self::addCoinsToCurrentPlayer($coins, Coin::SOURCE_REGISTER, $user);
        // send notification
        $user->notify((new VerifyEmail())->delay(now()->addMinute()));
        return $user;
    }

    public static function updatePlayer(array $data, Authenticatable $user, bool $email_update) : Player
    {
        // update user data
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->email_verified_at = $email_update ? null : $user->email_verified_at;
        $user->save();
        // update player data
        $user->userable->grade_id = $data['grade_id'];
        $user->userable->education_id = $data['education_id'];
        $user->userable->school =  $data['school'] ?? null;
        $user->userable->country_id = $data['country_id'];
        $user->userable->region_id = $data['region_id'] ?? null;
        $user->userable->city_id = $data['city_id'] ?? null;
        $user->userable->save();
        // return player object
        return $user->userable;
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
