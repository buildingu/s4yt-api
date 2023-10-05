<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RaffleItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'stock' => $this->stock,
            'active' => $this->active,
            'raffle_partner' => $this->parent->name,
            'raffle_partner_id' => $this->raffle_partner_id,
            'image' =>  asset('/items/'.$this->image),
        ];
    }
}
