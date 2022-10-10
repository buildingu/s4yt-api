<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'response',
        'saved',
        'submitted'
    ];

    public function question()
    {
        return $this->belongsTo('App\Models\Question');
    }

    public function player()
    {
        return $this->belongsTo('App\Models\Player');
    }
}