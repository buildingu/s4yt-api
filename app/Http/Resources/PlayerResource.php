<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    private $properties = [
        'coins'
    ];

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $data = [
            'id' => $this->id,
            'grade_id' => $this->grade_id,
            'education_id' => $this->education_id,
            'country_iso' => $this->country_iso,
            'state_iso' => $this->state_iso,
            'city_id' => $this->city_id,
            'instagram' => $this->instagram,
            'referred_by' => $this->referred_by,
            'referral_code' => $this->referral_code,
            'coins' => $this->coins,
            'status' => $this->status
        ];

        if($request->has('with')){
            $with = explode(',',$request->input('with'));

            foreach($with as $prop){
                if(in_array($prop,$this->properties)){
                    $data[$prop] = $this->$prop;
                }
            }
        }

        return $data;
    }
}
