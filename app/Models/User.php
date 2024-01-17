<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Passport\HasApiTokens;
use App\Traits\UsesUuid;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasProfilePhoto, Notifiable, TwoFactorAuthenticatable, UsesUuid, HasRoles;

    const SUPER_ADMIN_ROLE = 'super_admin';
    const ADMIN_ROLE = 'admin';
    const EVENT_PARTNER_ROLE = 'event_partner';
    const EVENT_PARTNER_GUEST_ROLE = 'event_partner_guest';
    const RAFFLE_PARTNER_ROLE = 'raffle_partner';
    const SPONSOR_PARTNER_ROLE = 'sponsor_partner';
    const PLAYER_ROLE = 'player';
    const BU_PLAYER_ROLE = 'bu_player';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function versions() : BelongsToMany
    {
        return $this->belongsToMany(Version::class, 'user_version');
    }

    public static function getSuperAdminUser()
    {
        return self::role(self::SUPER_ADMIN_ROLE)->first();
    }

    /**
     * Get the owning userable model.
     */
    public function userable()
    {
        return $this->morphTo();
    }
}
