<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RafflePartner extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'short_description',
        'items_confirmed',
        'status'
    ];
}
