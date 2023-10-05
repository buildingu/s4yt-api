<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RaffleItemResource;
use App\Services\RaffleItemService;
use Illuminate\Http\Request;

class RaffleItemController extends Controller
{
    public function index()
    {
        $items = (new RaffleItemService())->getAll();
        return RaffleItemResource::collection($items);
    }

    public function show($id)
    {
        $item = (new RaffleItemService())->show($id);
        return RaffleItemResource::collection($item);
    }
}
