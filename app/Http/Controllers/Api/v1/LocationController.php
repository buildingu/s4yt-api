<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\GetCitiesRequest;
use App\Http\Requests\GetRegionsRequest;
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
     * @param GetRegionsRequest $request
     * @return JsonResponse
     */
    public function getRegions(GetRegionsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $regions = LocationService::getStatesByCountryId($validated['country_id']);

        if (sizeof($regions) == 0) {
            return $this->sendError('No regions found');
        }

        return $this->sendResponse(
            [
                'regions' => $regions,
            ],
            "List of regions of given country"
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
        $cities = LocationService::getCitiesByRegionId($validated['region_id']);

        if (sizeof($cities) == 0) {
            return $this->sendError('No cities found');
        }

        return $this->sendResponse(
            [
                'cities' => $cities
            ],
            "List of cities of given state"
        );
    }
}
