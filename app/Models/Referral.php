<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
