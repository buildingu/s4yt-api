<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CoinType;
use App\Models\CoinDescription;

class Coin extends Model
{
	protected $hidden = [
		'created_at'
	];
    protected $with = [
        'description'
    ];

	public function type()
    {
        return $this->belongsTo(CoinType::class,'coin_type_id');
    }

    public function description()
    {
        return $this->belongsTo(CoinDescription::class,'coin_description_id');
    }
}
