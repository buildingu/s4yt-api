<?php

namespace App\Services;

use Illuminate\Support\Arr;
use App\Models\Referral;

class ReferralService
{

    public function create(array $data){
        return Referral::create([
            'user_id'=>$data['user_id'],
            'name'=>$data['name'],
            'email'=>$data['email']
        ]);
    }

    public function update(Array $data, Referral $referral){
        $referral->status = $data['status'];
        $referral->save();

        return $referral;
    }
}
