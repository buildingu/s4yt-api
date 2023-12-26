<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoinType extends Model
{

    const TYPE_REGISTER = 'register';
    const TYPE_REFERRAL = 'referral';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public static function getTypeByKey(string $key)
    {
        return (self::where('event', $key)->first())->id;
    }
}
