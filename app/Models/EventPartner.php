<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;

class EventPartner extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'organization_name',
        'slug',
        'description',
        'meet_day',
        'meet_from',
        'meet_to',
        'meet_link',
        'youtube_link',
    ];

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('logo_default')
            ->singleFile();
        $this
            ->addMediaCollection('logo_s4yt')
            ->singleFile();
    }

    /**
     * Get the event partner's user.
     */
    public function user() : MorphOne
    {
        return $this->morphOne('App\Models\User', 'userable');
    }
}
