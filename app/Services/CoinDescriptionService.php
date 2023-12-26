<?php

namespace App\Services;

use App\Models\CoinDescription;
use Illuminate\Support\Str;

class CoinDescriptionService
{
    public function create(String $description){
        $coinDescription = CoinDescription::firstOrCreate([
            'text' => Str::lower($description)
        ]);

        return $coinDescription;
    }
}
