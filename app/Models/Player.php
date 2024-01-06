<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use App\Traits\Referable;

class Player extends Model
{
    use HasFactory, Referable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'education_id',
        'grade_id',
        'country_id',
        'region_id',
        'city_id'
    ];

    /**
     * Get the player's user.
     */
    public function user() : MorphOne
    {
        return $this->morphOne('App\Models\User', 'userable');
    }
}
