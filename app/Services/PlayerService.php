<?php

namespace App\Services;

use App\Models\Coin;
use App\Models\CoinType;
use App\Models\Configuration;
use App\Models\User;
use App\Models\Player;
use Illuminate\Support\Facades\Hash;

class PlayerService
{

    
    public function create(array $data, User $user): Player
    {
        $player = Player::create([
            'education_id' => $data['education_id'],
            'grade_id' => $data['grade_id'],
            'country_iso' => $data['country_iso'],
            'state_iso' => $data['state_iso'],
            'city_id' => $data['city_id'],
            'instagram' => isset($data['instagram']) ? $data['instagram'] : null,
            'referred_by' => isset($data['referred_by']) ? $data['referred_by'] : null
        ]);

        $player->user()->save($user);
        
        factory(Coin::class,(int) Configuration::getValueByKey(Configuration::REGISTER_COINS))->create([
            'player_id' => $player->id,
            'coin_type_id' => CoinType::getTypeByKey(CoinType::TYPE_REGISTER)
        ]);

        return $player;
    }

    public function update(array $data, Player $player){
        $player->fill(
            $data
        )->save();

        return $player;
    }
}
