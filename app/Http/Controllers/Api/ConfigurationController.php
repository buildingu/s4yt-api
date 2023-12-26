<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuration;

class ConfigurationController extends Controller
{
    public function index(Request $request)
    {
        return $this->sendResponse(
            Configuration::with('versions')->get(),
            "Configuration"
        );
    }
}
