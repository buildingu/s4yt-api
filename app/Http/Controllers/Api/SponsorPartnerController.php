<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SponsorResource;
use App\Models\SponsorPartner;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SponsorPartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke()
    {
        $sponsors = SponsorPartner::query()->orderByDesc('created_at')->get();
        return SponsorResource::collection($sponsors);

    }
}
