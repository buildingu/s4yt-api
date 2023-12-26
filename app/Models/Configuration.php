<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Configuration extends Model
{
    const REGISTER_COINS = 'register_coins';
    const REFERRAL_COINS = 'referral_coins';
    const MAX_REVIEWERS = 'max_reviewers';
    const MAX_AMOUNT_REWARDS = 'max_amount_awards';
    const MAX_EVENT_PARTNERS = 'max_event_partners';
    const GAME_START = 'game_start';
    const GAME_END = 'game_end';
    const WINNERS_ANNOUNCED = 'winners_announced';
    const LOGIN_DISABLED = 'login_disabled';
    const DEFAULT_PASSWORD = 'default_password';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'key'
    ];

    public function type()
    {
        return $this->belongsTo('App\Models\DataType','data_type_id');
    }

    public function versions()
    {
        $version_id = Cache::remember('current_version', 60*60*24*28, function() {
            return Version::currentVersion();
        });

        return $this->hasOne('App\Models\ConfigurationVersion','configuration_id')->where('version_id',$version_id);
    }

    public static function getValueByKey(string $key)
    {
        
        return ((self::where('key', $key)->first())->versions()->get())[0]->value;
    }
}
