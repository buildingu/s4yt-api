<?php

namespace App\Services;

use App\Models\City;
use App\Models\Country;
use App\Models\State;
use Illuminate\Database\Eloquent\Collection;

class LocationService
{
    /**
     * Method returns countries data
     * @return Collection
     */
    public static function getCountries() : Collection
    {
        return Country::select('id', 'name')->get();
    }

    /**
     * Method return states data of given country identifier
     * @param int $country_id
     * @return Collection
     */
    public static function getStatesByCountryId(int $country_id) : Collection
    {
        return State::select('id', 'name')->where('country_id', $country_id)->get();
    }

    /**
     * Method return cities data of given state identifier
     * @param int $state_id
     * @return Collection
     */
    public static function getCitiesByStateId(int $state_id) : Collection
    {
        return City::select('id', 'name')->where('state_id', $state_id)->get();
    }
}
