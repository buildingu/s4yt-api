<?php

namespace App\Services;

use App\Models\Coin;
use App\Models\RaffleItem;
use App\Models\Version;
use Illuminate\Support\Facades\Auth;

class RaffleService
{
    /**
     * Method returns data for raffle page
     * @param $current_version_id
     * @param bool $is_event
     * @return array
     */
    public static function getRaffleItems($current_version_id, bool $is_event = false) : array
    {
        $raffle = [];
        $raffle_items = RaffleItem::whereHas('versions', function($q) use ($current_version_id){
            $q->where('version_id', $current_version_id);
        })->where('active', true)->get();

        foreach ($raffle_items as $raffle_item) {
            $raffle_item_version =  $raffle_item->versions()->withPivot(['id','stock', 'active'])->wherePivot('version_id', $current_version_id)->first();
            $raffle_partner = $raffle_item->rafflePartner;
            if($raffle_item_version->pivot->active && $raffle_partner->active) {
                $raffle_data = [
                    'id' => $raffle_item->id,
                    'silver' => Coin::where('raffle_item_version_id', $raffle_item_version->pivot->id)->count() == 0,
                ];
                if(!$is_event) {
                    $raffle_data['name'] = $raffle_item->name;
                    $raffle_data['description'] = $raffle_item->description;
                    $raffle_data['image_src'] = $raffle_item->getFirstMediaUrl('main');
                    $raffle_data['stock'] = $raffle_item_version->pivot->stock;
                    $raffle_data['coins'] = Coin::where([
                        ['user_version_id', (Auth::user())->versions()->withPivot(['id'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->id],
                        ['raffle_item_version_id', $raffle_item_version->pivot->id]
                    ])->count();
                    $raffle_data['raffle_partner'] = [
                        'organization_name' => $raffle_partner->organization_name,
                        'logo_default' => $raffle_partner->getFirstMediaUrl('logo_default'),
                        'resource_link' => $raffle_partner->resource_link
                    ];
                }
                $raffle[] = $raffle_data;
            }
        }
        return $raffle;
    }


}
