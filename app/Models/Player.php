<?php

namespace App\Models;

use App\Traits\Referable;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Player extends Model implements HasMedia
{
    use Referable, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'grade_id',
        'education_id',
        'country_iso',
        'state_iso',
        'city_id',
        'instagram',
        'referred_by'
    ];

    /**
     * Get the player's user.
     */
    public function user()
    {
        return $this->morphOne('App\Models\User', 'userable');
    }

    /**
     * Get the player's education.
     */
    public function education()
    {
        return $this->belongsTo('App\Models\Education');
    }

    /**
     * Get the player's grade.
     */
    public function grade()
    {
        return $this->belongsTo('App\Models\Grade');
    }

    public function answer()
    {
        return $this->hasMany('App\Models\Answer');
    }

    public function coins()
    {
        return $this->hasMany('App\Models\Coin');
    }
}
