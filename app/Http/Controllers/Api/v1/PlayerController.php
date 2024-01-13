<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Education;
use App\Models\Grade;
use App\Services\PlayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlayerController extends Controller
{
    /**
     * Method returns list of education
     * @return JsonResponse
     */
    public function getEducation(): JsonResponse
    {
        return $this->sendResponse(
            [
                'education' => Education::select('id', 'name')->get()
            ],
            "List of education"
        );
    }

    /**
     * Method returns list of grades
     * @return JsonResponse
     */
    public function getGrades(): JsonResponse
    {
        return $this->sendResponse(
            [
                'grades' => Grade::select('id', 'name')->get()
            ],
            "List of grades"
        );
    }
}
