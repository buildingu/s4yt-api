<?php

namespace App\Observers;

use Illuminate\Support\Facades\Notification;
use App\Notifications\ReferralEmail;
use App\Models\Coin;
use App\Models\CoinType;
use App\Models\Configuration;
use App\Models\Referral;

class ReferralObserver
{
    /**
     * Handle the referral "created" event.
     *
     * @param  \App\Referral  $referral
     * @return void
     */
    public function created(Referral $referral)
    {
        Notification::route('mail', [
            $referral->email => $referral->name,
        ])->notify(new ReferralEmail($referral));
    }

    /**
     * Handle the referral "updated" event.
     */
    public function updated(Referral $referral)
    {
        if($referral->status === 'accepted'){
            factory(Coin::class,(int) Configuration::getValueByKey(Configuration::REFERRAL_COINS))->create([
                'player_id' => $referral->user->userable_id,
                'coin_type_id' => CoinType::getTypeByKey(CoinType::TYPE_REFERRAL)
            ]);
        }
    }
}
