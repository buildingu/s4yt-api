<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\Education;
use App\Models\Grade;
use App\Models\User;
use App\Notifications\VerifyEmail;
use App\Services\PlayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Token;

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

    /**
     * Method allow authenticated users to update their password.
     * @param UpdatePasswordRequest $request
     * @return JsonResponse
     */
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

    /**
     * Method returns a summary of the coins.
     * @return JsonResponse
     */
    public function getCoinsDetails(): JsonResponse
    {
        return $this->sendResponse([
            'coin_details' => PlayerService::getCurrentPlayerCoinsTable(Auth::user())
        ], "Coin details");
    }

    /**
     * Method returns a detail of the referrals of a given authenticated user.
     * @return JsonResponse
     */
    public function getReferrals(): JsonResponse
    {
        return $this->sendResponse([
            'referrals' => PlayerService::getReferrals(Auth::user()->userable->id)
        ], "Collection of referrals");
    }

    /**
     * Method updates profile player info of the authenticated user.
     * @param UpdateProfileRequest $request
     * @return JsonResponse
     */
    public function updateProfile(UpdateProfileRequest $request) : JsonResponse
    {
        $validated = $request->validated();
        $email_update = false;
        if($validated['email'] != Auth::user()->email) {
            $check = User::where('email', $validated['email'])->count();
            if($check > 0) {
                return $this->sendError('Email already taken.', ['email' => 'Email is already in use.'], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            $email_update = true;
        }
        $player = PlayerService::updatePlayer($validated, Auth::user(), $email_update);
        if($email_update) {
           $player->user->notify((new VerifyEmail())->delay(now()->addMinute()));
            Token::where('user_id', Auth::id())->update(['revoked' => true]);
        }
        return $this->sendResponse(
            [
                'verify_email' => $email_update,
                'user' => [
                    'email' => Auth::user()->email,
                    'name' =>  Auth::user()->name,
                    'grade_id' => $player->grade_id,
                    'education_id' => $player->education_id,
                    'school' => $player->school,
                    'country_id' => $player->country_id,
                    'region_id' => $player->region_id,
                    'city_id' => $player->city_id,
                ],
            ],
            "Player updated successfully"
        );
    }
}
