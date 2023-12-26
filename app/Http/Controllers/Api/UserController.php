<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Services\ReferralService;
use App\Models\User;
use App\Models\Referral;

class UserController extends Controller
{
    public function store(UserRequest $request)
    {
        $data = $request->all();
        $user = (new UserService())->create($data);

        if($request->has('referral')){
            $referral = Referral::find($data['referral']);

            if($referral && $referral->email && $referral !== 'accepted'){
                (new ReferralService())->update(['status'=>'accepted'],$referral);
            }
        }

        return new UserResource($user);
    }

    public function update(UserRequest $request, String $id)
    {
        $user = User::find($id);

        (new UserService())->update($request->all(),$user);
        
        return new UserResource($user->refresh());
    }

    public function current(Request $request)
    {
        $request->merge(['with'=>'coins,description']);
        
        return new UserResource($request->user()->refresh());
    }
}
