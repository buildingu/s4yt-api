<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\Education;
use App\Models\Grade;
use App\Models\User;
use App\Services\PlayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;

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

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = Auth::user();
        if(!Hash::check($validated['old_password'], $user->password)) {
            return $this->sendError('Current password do not match our records.');
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();
        return $this->sendResponse([], "Player password updated successfully");
    }

    public function getCoinsDetails(): JsonResponse
    {
        return $this->sendResponse([
            'coin_details' => PlayerService::getCurrentPlayerCoinsTable(Auth::user())
        ], "Coin details");
    }
}
