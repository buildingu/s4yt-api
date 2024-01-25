<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class RafflePartner extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'organization_name',
        'description',
    ];

    /**
     * Get the raffle partner's user.
     */
    public function user() : MorphOne
    {
        return $this->morphOne('App\Models\User', 'userable');
    }
}
