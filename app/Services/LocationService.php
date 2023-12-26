<?php


namespace App\Services;


use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class LocationService
{
    private static $client;

    public function __construct()
    {
        static::$client = Http::withoutVerifying()
        ->withHeaders([
            'X-CSCAPI-KEY' => config('cities_api.api_key'),
        ]);
    }

    public static function getCountries()
    {
        return static::$client->get(config('cities_api.base_url') . 'countries');
    }

    public static function getStates(string $ciso)
    {
        return static::$client->get(config('cities_api.base_url') . 'countries/' . $ciso . '/states');
    }

    public static function getCities(string $ciso, string $siso)
    {
        return static::$client->get(config('cities_api.base_url') . 'countries/' . $ciso . '/states' . '/' . $siso . '/cities');
    }

    public static function getLocationData(array $location_data) : array
    {
        $location = [];
        $countries = (self::getCountries())->json();
        $states = null;
        $cities = null;

        foreach($countries as $country) {
            if($country['iso2'] == $location_data['country_iso']){
                $location['country_name'] = $country['name'];
                $states = (self::getStates($location_data['country_iso']))->json();
                break;
            }
        }

        foreach($states as $state) {
            if($state['iso2'] == $location_data['state_iso']){
                $location['state_name'] = $state['name'];
                $cities = (self::getCities($location_data['country_iso'], $location_data['state_iso']))->json();
                break;
            }
        }

        foreach($cities as $city) {
            if($city['id'] == $location_data['city_id']) {
                $location['city_name'] = $city['name'];
                break;
            }
        }

        $location['countries'] = $countries;
        $location['states'] = $states;
        $location['cities'] = $cities;
        
        return $location;
    }
}
