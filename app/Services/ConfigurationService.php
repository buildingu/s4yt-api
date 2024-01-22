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

    public static function getValueByKeyAndVersionId(string $key, $version_id)
    {
        return (Configuration::getConfigurationByKey($key))->versions()->withPivot(['value'])->wherePivot('version_id', $version_id)->first()->pivot->value ?? null;
    }

    public static function setCurrentValueByKey(string $key, string $value)
    {
        $pivot = (Configuration::getConfigurationByKey($key))->versions()->withPivot(['value'])->wherePivot('version_id',Version::currentVersionId())->first()->pivot ?? null;
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

    public static function addConfiguration($key, $description, $data_type) : Configuration
    {
        return Configuration::create([
            'key' => $key,
            'description' => $description,
            'configuration_data_type_id' => $data_type,
        ]);
    }

    public static function updateConfiguration($key, $description, $data_type, $configuration_id) : ?Configuration
    {
        $configuration = Configuration::find($configuration_id);
        if(!$configuration) {
            return null;
        }
        $configuration->key = $key;
        $configuration->description = $description;
        $configuration->configuration_data_type_id = $data_type;
        $configuration->save();
        return $configuration;
    }
}
