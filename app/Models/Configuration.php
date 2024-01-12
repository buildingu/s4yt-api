<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Configuration extends Model
{
    use HasFactory;

    const REGISTER_COINS = 'register_coins';
    const REFERRAL_COINS = 'referral_coins';
    const INSTAGRAM_COINS = 'instagram_coins';
    const GAME_START = 'game_start';
    const GAME_END = 'game_end';
    const WINNERS_ANNOUNCED = 'winners_announced';
    const LOGIN_DISABLED = 'login_disabled';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'description'
    ];

    public static function getConfigurationByKey(string $key) : Configuration
    {
        return self::where('key', $key)->first();
    }

    public function configurationDataType() : BelongsTo
    {
        return $this->belongsTo(ConfigurationDataType::class);
    }

    public function versions() : BelongsToMany
    {
        return $this->belongsToMany(Version::class, 'configuration_version');
    }

    public static function getCurrentValueByKey(string $key)
    {
        return (self::getConfigurationByKey($key))->versions()->withPivot(['value'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->value;
    }
}
