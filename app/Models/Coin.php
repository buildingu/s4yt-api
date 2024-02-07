<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coin extends Model
{
    use HasFactory;

    const SOURCE_REGISTER = 1;
    const SOURCE_QUEST = 2;
    const SOURCE_INSTAGRAM = 3;
    const SOURCE_REFERRAL = 4;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'raffle_item_version_id',
    ];

    public static function getRaffleItemCoins($raffle_item_version_id, $winner_coin_ids, $user_version_id = null)
    {
        $raffle_item_coins = Coin::where([
            ['raffle_item_version_id', $raffle_item_version_id],
            ['available', false],
        ])->whereNotIn('id', $winner_coin_ids);

        return isset($user_version_id) ? $raffle_item_coins->where('user_version_id', $user_version_id)->first() : $raffle_item_coins;
    }
}
