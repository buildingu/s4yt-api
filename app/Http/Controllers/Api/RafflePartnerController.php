<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RaffleItemPartnerResource;
use App\Services\RafflePartnerService;
use Illuminate\Http\Request;

class RafflePartnerController extends Controller
{
    public function index()
    {
        $items = (new RafflePartnerService())->getAll();
        return RaffleItemPartnerResource::collection($items);
    }

    public function show($id)
    {
        $item = (new RafflePartnerService())->show($id);
        return RaffleItemPartnerResource::collection($item);
    }
}
