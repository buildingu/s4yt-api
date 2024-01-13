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
    const REGISTER_START = 'register_start';
    const GAME_START = 'game_start';
    const REVIEW_START = 'review_start';
    const REVIEW_END = 'review_end';
    const GAME_END = 'game_end';

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
}
