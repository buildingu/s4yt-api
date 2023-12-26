<?php

namespace App\Http\Controllers\Api;

use App\Models\Education;
use App\Models\Grade;
use App\Http\Controllers\Controller;
use App\Http\Requests\StatesRequest;
use App\Http\Requests\CitiesRequest;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class RegisterController extends Controller
{

    /**
     * Returns list of countries
     *
     * @param LocationService $locationService
     * @return JsonResponse
     */
    public function getCountries(LocationService $locationService): JsonResponse
    {
        $countries = Cache::remember('countries', 60*60*24*7, function() {
            return ( LocationService::getCountries())->json();
        });

        return $this->sendResponse(
            [
               'countries' => $countries
            ],
            "List of countries"
        );
    }

    /**
     * Returns list of states based on country ISO
     *
     * @param StatesRequest $request
     * @param LocationService $locationService
     * @return JsonResponse
     */
    public function getStates(StatesRequest $request, LocationService $locationService): JsonResponse
    {
        $validated = $request->validated();

        $states = Cache::remember('states_' . $validated['ciso'], 60*60*24*7, function() use ($locationService, $validated) {
            return (LocationService::getStates($validated['ciso']))->json();
        });

        return $this->sendResponse(
            [
                'country' =>  $validated['ciso'],
                'states' => $states
            ],
            "List of states by country"
        );
    }

    /**
     * Returns list of cities based on country ISO and state ISO
     *
     * @param CitiesRequest $request
     * @param LocationService $locationService
     * @return JsonResponse
     */
    public function getCities(CitiesRequest $request, LocationService $locationService): JsonResponse
    {
        $validated = $request->validated();

        $cities = Cache::remember('cities_' . $validated['ciso'] . '_' . $validated['siso'], 60*60*24*7, function() use ($locationService, $validated) {
            return (LocationService::getCities($validated['ciso'], $validated['siso']))->json();
        });

        return $this->sendResponse(
            [
                'country' =>  $validated['ciso'],
                'state' => $validated['siso'],
                'cities' => $cities
            ],
            "List of cities by state and country"
        );
    }

    /**
     * Method returns array of educations
     *
     * @return JsonResponse
     */
    public function getEducations()
    {
        $educations = Education::select('id', 'name')->get();

        return $this->sendResponse(
            [
                'educations' => $educations
            ],
            "List of educations"
        );
    }

    /**
     * Method returns array of grades
     *
     * @return JsonResponse
     */
    public function getGrades()
    {
        $grades = Grade::select('id', 'name')->get();

        return $this->sendResponse(
            [
                'grades' => $grades
            ],
            "List of grades"
        );
    }
}
