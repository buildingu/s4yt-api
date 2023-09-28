<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SponsorPartner extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['short_description','description','image','status'];
}
