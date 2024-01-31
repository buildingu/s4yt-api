<?php

namespace App\Services;

use App\Models\Coin;
use App\Models\Configuration;
use App\Models\RaffleItem;
use App\Models\User;
use App\Models\Player;
use App\Models\Version;
use App\Notifications\UpdateCoinCounter;
use App\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

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
        $user = UserService::addUser($data, $admin);
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
        $user = UserService::updateUser($data, $user, $email_update);

        // update player data
        $player = $user->userable;
        $player->grade_id = $data['grade_id'];
        $player->education_id = $data['education_id'];
        $player->school =  $data['school'] ?? null;
        $player->country_id = $data['country_id'];
        $player->region_id = $data['region_id'] ?? null;
        $player->city_id = $data['city_id'] ?? null;
        $player->save();

        // send notify
        if($email_update) {
            $user->notify((new VerifyEmail())->delay(now()->addMinute()));
        }

        // return player object
        return $player;
    }

    private static function addCoinsToCurrentPlayer(int $coins, int $source, User $user) : void
    {
        Coin::factory()->count($coins)->create([
            'source' => $source,
            'user_version_id' => $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id
        ]);
    }

    public static function getCurrentPlayerCoins(Authenticatable $user, $total = true) : int
    {
        $coins = Coin::where('user_version_id', $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id);
        if($total) {
            $coins = $coins->where('available', true);
        }
        return $coins->count();
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
        return User::whereHasMorph('userable', [Player::class] ,function(Builder $query) use($player_id) { $query->where('referred_by', $player_id);})->select('created_at', 'name', 'email')->get();
    }

    public static function assignRaffleCoins(array $data, Authenticatable $user) : void
    {
        $user_version = $user->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id;
        Coin::where('user_version_id', $user_version)->update(['available' => true, 'raffle_item_version_id' => null]);
        foreach ($data as $datum) {
            $raffle_item = RaffleItem::find($datum['raffle_item_id']);
            $raffle_item_version =  $raffle_item->versions()->withPivot(['id'])->wherePivot('version_id', Version::currentVersionId())->first();
            Log::debug('raffleCoins', array("user_id" => $user->id, "raffle_item_id" => $raffle_item->id, "coins" => $datum['coins']));
            Coin::where([
                ['user_version_id', $user_version],
                ['available', true]
            ])->take($datum['coins'])->update(["raffle_item_version_id" => $raffle_item_version->pivot->id, "available" => false]);
        }
        $user->notify(new UpdateCoinCounter());
    }

    public static function addSponsorCoins(User $user, $coins) : Player
    {
        // add coins
        if($coins > 0) {
            self::addCoinsToCurrentPlayer($coins, Coin::SOURCE_QUEST, $user);
        }

        // update submitted
        $user->userable->quiz_submitted = true;
        $user->userable->save();
        $user->notify(new UpdateCoinCounter());
        return $user->userable;
    }

}
