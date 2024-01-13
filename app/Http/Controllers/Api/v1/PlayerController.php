<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Education;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

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

    /**
     * Method allows password reset by forgotten password process.
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = User::find($validated['id']);
        $user->password = Hash::make($validated['password']);
        $user->save();
        return $this->sendResponse([], "Player password updated successfully");
    }
}
