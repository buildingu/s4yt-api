<?php

namespace App\Services;

use App\Models\Configuration;
use App\Models\Version;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class VersionService
{
    public static function getCurrentVersionTimestamps() : array
    {
        $register_start = ConfigurationService::getCurrentValueByKey(Configuration::REGISTER_START);
        $game_start = ConfigurationService::getCurrentValueByKey(Configuration::GAME_START);
        $review_start = ConfigurationService::getCurrentValueByKey(Configuration::REVIEW_START);
        $review_end = ConfigurationService::getCurrentValueByKey(Configuration::REVIEW_END);
        $game_end = ConfigurationService::getCurrentValueByKey(Configuration::GAME_END);

        return [
          'register_start' => isset($register_start) ? Carbon::createFromFormat('Y-m-d H:i', $register_start) : "",
          'game_start' => isset($game_start) ? Carbon::createFromFormat('Y-m-d H:i', $game_start) : "",
          'review_start' => isset($review_start) ? Carbon::createFromFormat('Y-m-d H:i', $review_start) : "",
          'review_end' => isset($review_end) ? Carbon::createFromFormat('Y-m-d H:i', $review_end) : "",
          'game_end' => isset($game_end) ? Carbon::createFromFormat('Y-m-d H:i', $game_end) : "",
        ];
    }

    public static function getCountdown($first_time, $second_time) : string
    {
        $seconds = $first_time->diffInSeconds($second_time);
        if($seconds < 86400) {
            return gmdate('H:i:s', $seconds);
        } else {
            return sprintf("%02d%s%02d%s%02d", floor($seconds/3600), ":", ($seconds/60)%60, ":", $seconds%60);
        }
    }

    /**
     * Method add version.
     * @param $year
     * @param $active
     * @return Version
     */
    public static function addVersion($year, $active) : Version
    {
        $version = Version::create([
            'year' => $year
        ]);
        self::disableAllVersions($active);
        $version->active = $active;
        $version->save();
        return $version;
    }

    /**
     * Method updates version data.
     * @param $year
     * @param $active
     * @param $id
     * @return Version|null
     */
    public static function updateVersion($year, $active, $id) : ?Version
    {
        $version = Version::find($id);
        if(!$version) {
            return null;
        }
        $version->year = $year;
        self::disableAllVersions($active);
        $version->active = $active;
        $version->save();
        return $version;
    }

    /**
     * Method mass updated the Version model. Only one version enabled at a time is allowed.
     * @param $active
     * @return void
     */
    private static function disableAllVersions($active) : void
    {
        if($active) {
            Version::query()->update(['active' => false]);
        }
    }

    /**
     * Method updates version configuration values
     * @param $configuration_version_values
     * @return void
     */
    public static function setConfigurationVersionValues($configuration_version_values) : void
    {
        foreach ($configuration_version_values as $key => $value) {
            Log::debug('test', array('key' => $key, 'value' => $value));
            ConfigurationService::setCurrentValueByKey($key, $value['value'] ?? "");
        }
    }

}
