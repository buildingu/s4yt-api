<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetRaffleCoinsRequest;
use App\Models\Coin;
use App\Models\RaffleItem;
use App\Models\Version;
use App\Services\PlayerService;
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

        $raffle = [];
        $raffle_items = RaffleItem::whereHas('versions', function($q) use ($current_version_id){
            $q->where('version_id', $current_version_id);
        })->where('active', true)->get();

        foreach ($raffle_items as $raffle_item) {
            $raffle_item_version =  $raffle_item->versions()->withPivot(['id','stock', 'active'])->wherePivot('version_id', $current_version_id)->first();
            $raffle_partner = $raffle_item->rafflePartner;
            if($raffle_item_version->pivot->active && $raffle_partner->active) {
                $raffle[] = [
                    'id' => $raffle_item->id,
                    'name' => $raffle_item->name,
                    'description' => $raffle_item->description,
                    'image_src' => $raffle_item->getFirstMediaUrl('main'),
                    'stock' => $raffle_item_version->pivot->stock,
                    'coins' => Coin::where([
                        ['user_version_id', (Auth::user())->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id],
                        ['raffle_item_version_id', $raffle_item_version->pivot->id]
                    ])->count(),
                    'raffle_partner' => [
                        'organization_name' => $raffle_partner->organization_name,
                        'logo_default' => $raffle_partner->getFirstMediaUrl('logo_default'),
                        'resource_link' => $raffle_partner->resource_link
                    ]
                ];
            }
        }


        return $this->sendResponse([
            'raffle_items' => $raffle
        ], "List of raffle items");
    }

    public function setRaffleCoins(SetRaffleCoinsRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $user = Auth::user();
        $available_coins = PlayerService::getCurrentPlayerCoins($user, false);

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
