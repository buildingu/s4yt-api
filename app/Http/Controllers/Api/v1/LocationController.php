<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\GetCitiesRequest;
use App\Http\Requests\GetStatesRequest;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Method returns list of countries
     * @return JsonResponse
     */
    public function getCountries(): JsonResponse
    {
        return $this->sendResponse(
            [
                'countries' => LocationService::getCountries()
            ],
            "List of countries"
        );
    }

    /**
     * Method returns list of states of given country
     * @param GetStatesRequest $request
     * @return JsonResponse
     */
    public function getStates(GetStatesRequest $request): JsonResponse
    {
        $validated = $request->validated();
        return $this->sendResponse(
            [
                'states' => LocationService::getStatesByCountryId($validated['country_id'])
            ],
            "List of states of given country"
        );
    }

    /**
     * Method returns list of states of given state
     * @param GetCitiesRequest $request
     * @return JsonResponse
     */
    public function getCities(GetCitiesRequest $request): JsonResponse
    {
        $validated = $request->validated();
        return $this->sendResponse(
            [
                'cities' => LocationService::getCitiesByStateId($validated['state_id'])
            ],
            "List of cities of given state"
        );
    }
}
