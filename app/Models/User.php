<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Passport\HasApiTokens;
use App\Notifications\PasswordResetEmail;

class User extends Authenticatable
{
    use Notifiable, HasRoles, Uuids, HasApiTokens;

    const SUPER_ADMIN_ROLE = 'super_admin';
    const ADMIN_ROLE = 'admin';
    const EVENT_PARTNER_ROLE = 'event_partner';
    const RAFFLE_PARTNER_ROLE = 'raffle_partner';
    const PLAYER_ROLE = 'player';
    const BU_PLAYER_ROLE = 'bu_player';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the owning userable model.
     */
    public function userable()
    {
        return $this->morphTo();
    }

    public function versions()
    {
        return $this->belongsToMany('App\Models\Version');
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordResetEmail($token));
    }
}
