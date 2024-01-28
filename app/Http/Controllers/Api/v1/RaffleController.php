<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\RaffleItem;
use App\Models\Version;
use Illuminate\Http\JsonResponse;

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
            $pivot =  $raffle_item->versions()->withPivot(['stock', 'active'])->wherePivot('version_id', $current_version_id)->first()->pivot;
            $raffle_partner = $raffle_item->rafflePartner;
            if($pivot->active && $raffle_partner->active) {
                $raffle[] = [
                    'id' => $raffle_item->id,
                    'name' => $raffle_item->name,
                    'description' => $raffle_item->description,
                    'image_src' => $raffle_item->getFirstMediaUrl('main'),
                    'stock' => $pivot->stock,
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
}
