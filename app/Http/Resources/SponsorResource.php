<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SponsorResource extends JsonResource
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
            'id' => $this->id,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'status' => $this->status == 1 ? 'Active' : 'Deactivate',
            'image' => asset('/sponsors/'.$this->image)
        ];
    }
}
