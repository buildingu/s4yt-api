<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class RafflePartner extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'organization_name',
        'description',
    ];

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('logo_default')
            ->singleFile();
    }

    /**
     * Get the raffle partner's user.
     */
    public function user() : MorphOne
    {
        return $this->morphOne('App\Models\User', 'userable');
    }

    /**
     * Get the raffle partner's raffle items.
     * @return HasMany
     */
    public function raffleItems() : HasMany
    {
        return $this->hasMany(RaffleItem::class);
    }
}
