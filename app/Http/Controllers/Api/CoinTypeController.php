<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\CoinType;

class CoinTypeController extends Controller
{
    public function index(Request $request)
    {
        return $this->sendResponse(
            CoinType::all(),
            "List of coin types"
        );
    }
}
