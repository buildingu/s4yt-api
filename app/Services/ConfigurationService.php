<?php

namespace App\Services;

use App\Models\Configuration;
use App\Models\User;
use App\Models\Version;
use Illuminate\Support\Facades\Auth;

class ConfigurationService
{
    public static function getCurrentValueByKey(string $key)
    {
        return (Configuration::getConfigurationByKey($key))->versions()->withPivot(['value'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot->value ?? null;
    }

    public static function setCurrentValueByKey(string $key, string $value)
    {
        $pivot = (Configuration::getConfigurationByKey($key))->versions()->withPivot(['value'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot;
        if(isset($pivot)) {
            $pivot->value=$value;
            $pivot->updated_by = Auth::id() ?? (User::getSuperAdminUser())->id;
            $pivot->save();
        } else {
            Configuration::getConfigurationByKey($key)->versions()->attach(Version::currentVersionId(), [
                'value' => $value,
                'created_by' => Auth::id() ?? (User::getSuperAdminUser())->id
            ]);
        }
    }
}
