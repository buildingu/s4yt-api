<?php

namespace App\Http\Controllers\Api\v1;

use App\Events\RaffleUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\SetRaffleCoinsRequest;
use App\Models\Coin;
use App\Models\RaffleItem;
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

}
