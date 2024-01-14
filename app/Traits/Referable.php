<?php

namespace App\Traits;

use App\Models\User;
use App\Models\Version;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

trait Referable
{

    protected static function bootReferable(): void
    {
        static::creating(function ($model) {
            if ($referredBy = Cookie::get('referral_code')) {
                $id = (User::where('referral_code', $referredBy)->first())->id;
                $model->referred_by = $id;
            }
            $model->referral_code = self::generateReferral();
        });
    }

    /**
     * Method returns the referral link to share
     *
     * @return string
     */
    public function getReferralLink(): string
    {
        return config('app.front_url') .'/?referral_code='.$this->referral_code . '&version_id=' . Version::currentVersionId();
    }

    /**
     * Method provides a scope to check if a referral code is already in use
     *
     * @param Builder $query
     * @param string $referral_code
     * @return bool
     */
    protected static function scopeReferralFound(Builder $query, string $referral_code): bool
    {
        return $query->where('referral_code', $referral_code)->exists();
    }

    /**
     * Method generates a random referral code that does not exist in DB
     *
     * @return string
     */
    protected static function generateReferral(): string
    {
        $length = config('referral.length',20);

        do {
            $referral_code = Str::random($length);
        }while(static::referralFound($referral_code));

        return $referral_code;
    }
}
