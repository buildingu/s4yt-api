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
use Spatie\Permission\Traits\HasRoles;
use App\Traits\UsesUuid;

class User extends Authenticatable
{
    use HasRoles, HasApiTokens, HasFactory, HasProfilePhoto, Notifiable, TwoFactorAuthenticatable, UsesUuid;

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
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'default'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
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
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    public function versions() : BelongsToMany
    {
        return $this->belongsToMany(Version::class, 'user_version');
    }

    public static function getSuperAdminUser()
    {
        return self::role(self::SUPER_ADMIN_ROLE)->first();
    }
}
