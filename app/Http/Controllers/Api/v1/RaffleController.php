<?php

namespace App\Http\Controllers\Api\v1;

use App\Events\RaffleUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\SetRaffleCoinsRequest;
use App\Models\Coin;
use App\Models\Country;
use App\Models\RaffleItem;
use App\Models\RaffleWinner;
use App\Models\Region;
use App\Models\User;
use App\Models\UserVersion;
use App\Models\Version;
use App\Services\PlayerService;
use App\Services\RaffleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class RaffleController extends Controller
{
    public function getRaffleItems()  : JsonResponse
    {
        $current_version_id = Version::currentVersionId();
        if(!isset($current_version_id)) {
            return $this->sendError("No active version found");
        }

        return $this->sendResponse([
            'raffle_items' => RaffleService::getRaffleItems($current_version_id)
        ], "List of raffle items");
    }

    public function setRaffleCoins(SetRaffleCoinsRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $user = Auth::user();
        $available_coins = PlayerService::getCurrentPlayerCoins($user);

        // additional validation
        $raffle_flag = [];
        $total_coins = 0;
        foreach ($validated['raffle'] as $raffle) {
            $total_coins += $raffle['coins'];
            $raffle_item = RaffleItem::find($raffle['raffle_item_id']);
            $raffle_partner = $raffle_item->rafflePartner;
            $pivot =  $raffle_item->versions()->withPivot(['stock', 'active'])->wherePivot('version_id', Version::currentVersionId())->first()->pivot;
            if(!$raffle_item->active || !$raffle_partner->active || !$pivot->active) {
                $raffle_flag[] = [
                    'message' => 'Raffle item id ' . $raffle['raffle_item_id'] . ' not valid'
                ];
            }
        }

        if($total_coins > $available_coins) {
            return $this->sendError("Exceed available coins", [], 422);
        }

        if(sizeof($raffle_flag) != 0) {
            return $this->sendError("Raffle item not valid", $raffle_flag, 422);
        }

        PlayerService::assignRaffleCoins($validated['raffle'],$user);

        return $this->sendResponse([], "Coins assigned successfully");
    }

    public function getRaffleWinners() : JsonResponse
    {
        $data = [];
        $current_version_id = Version::currentVersionId();
        $raffle_items = RaffleItem::whereHas('versions', function($q) use ($current_version_id){
            $q->where('version_id', $current_version_id);
        })->where('active', true)->get();

        if(sizeof($raffle_items) > 0) {
           foreach ($raffle_items as $raffle_item) {
               $raffle_item_version_id =  ($raffle_item->versions()->withPivot(['id'])->wherePivot('version_id', $current_version_id)->first())->pivot->id;
               $winners = RaffleWinner::where('raffle_item_version_id', $raffle_item_version_id)->get();

               $winners_data = [];
               if( sizeof($winners)> 0) {
                   foreach ($winners as $winner) {
                       $user = User::find(UserVersion::find($winner->user_version_id)->user_id);
                       if($user->userable_type == 'App\Models\Player') {
                           $player = $user->userable;
                           $winners_data[] = [
                               'name' => $user->name,
                               'country_name' => Country::find($player->country_id)->name,
                               'country_code' => Country::find($player->country_id)->iso3,
                               'region_name' => isset($player->region_id) ?  Region::find($player->region_id)->name : null,
                           ];
                       }

                   }

                   $data[] = [
                       'item_src' => $raffle_item->getFirstMediaUrl('main'),
                       'partner_logo' => $raffle_item->rafflePartner->getFirstMediaUrl('logo_default'),
                       'name' => $raffle_item->rafflePartner->organization_name,
                       'winners' => $winners_data
                   ];
               }


           }
        }
        return $this->sendResponse(['raffle_items' => $data], 'list of raffle winners');
    }

}
