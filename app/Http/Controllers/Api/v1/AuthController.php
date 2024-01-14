<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\SendVerifyEmailRequest;
use App\Models\Configuration;
use App\Models\User;
use App\Notifications\ResetPasswordEmail;
use App\Notifications\VerifyEmail;
use App\Notifications\WelcomeEmail;
use App\Services\ConfigurationService;
use App\Services\PlayerService;
use App\Services\VersionService;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Method registers new player
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $player = PlayerService::addPlayer($validated, intval(ConfigurationService::getCurrentValueByKey(Configuration::REGISTER_COINS)));
        Log::info('Player {$player->name} registered successfully.', ['id' => $player->id, 'email' => $player->user->email]);
        $player->user->notify((new VerifyEmail())->delay(now()->addMinute()));
        return $this->sendResponse(
            [
                'uuid' => $player->user->id,
                'email' => $player->user->email
            ],
            "Player registered successfully",
            Response::HTTP_CREATED
        );
    }

    /**
     * Method allows user to verify their email from the VerifyEmail notification.
     * @param $user_id
     * @param Request $request
     * @return RedirectResponse
     */
    public function verify($user_id, Request $request) : RedirectResponse
    {
        $user = User::findOrFail($user_id);
        if ($user->hasVerifiedEmail()) {
            $user->notify((new WelcomeEmail())->delay(now()->addMinute()));
            return redirect(config('app.front_url') . '/register/verify-email/success');
        }

        if (!$request->hasValidSignature()) {
            return redirect(config('app.front_url') . '/register/verify-email');
        }

        $user->markEmailAsVerified();
        $user->notify((new WelcomeEmail())->delay(now()->addMinute()));
        return redirect(config('app.front_url') . '/register/verify-email/success');
    }

    /**
     * Method allows user to confirm resetPassword request from the ResetPasswordEmail notification.
     * @param $user_id
     * @param Request $request
     * @return RedirectResponse
     */
    public function resetPassword($user_id, Request $request) : RedirectResponse
    {
        $user = User::findOrFail($user_id);
        if (!$request->hasValidSignature()) {
            return redirect(config('app.front_url') . '/login/forgot');
        }

        return redirect(config('app.front_url') . '/password-reset?id='. $user->id);
    }

    /**
     * Method send verification email
     * @param SendVerifyEmailRequest $request
     * @return JsonResponse
     */
    public function sendVerifyEmail(SendVerifyEmailRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->sendError('Player not registered');
        }

        $user->notify((new VerifyEmail())->delay(now()->addMinute()));

        return $this->sendResponse(
            [],
            "Mail sent successfully"
        );
    }

    /**
     * Method send ResetPasswordEmail notification
     * @param SendVerifyEmailRequest $request
     * @return JsonResponse
     */
    public function sendResetPasswordEmail(SendVerifyEmailRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->sendError('Player not registered');
        }

        $user->notify((new ResetPasswordEmail())->delay(now()->addMinute()));

        return $this->sendResponse(
            [],
            "Mail sent successfully"
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $now = Carbon::now();
        $timestamps = VersionService::getCurrentVersionTimestamps();
        if( ($now >= $timestamps['review_start'] && $now < $timestamps['review_end']) || $now >= $timestamps['game_end']) {
            return $this->sendError('Login disabled');
        }

        $user = User::where('id', $validated['player_id'])->first();

        if (!$user) {
            return $this->sendError('Player not registered');
        }

        if(!$user->hasVerifiedEmail()) {
            return $this->sendError('Player does not have validated email', [], Response::HTTP_UNAUTHORIZED);
        }

        if (!auth()->attempt(['id' => $validated['player_id'], 'password' => $validated['password']])) {
            return $this->sendError('Credentials not valid', [], Response::HTTP_UNAUTHORIZED);
        }

        $token = auth()->user()->createToken(env('APP_NAME'))->accessToken;
        $countdown  =Carbon::now() < $timestamps['game_start'] ?
            "The game has not started yet" :
            (Carbon::now() > $timestamps['review_end'] ?
                "The game has ended" :
                VersionService::getCountdown($timestamps['review_start'], $timestamps['game_start'])
                );

        return $this->sendResponse(
            [
                'auth' => 'Bearer',
                'token' => $token,
                'user' => [
                    'name' =>  Auth::user()->name,
                    'grade_id' => Auth::user()->userable->grade_id,
                    'education_id' => Auth::user()->userable->education_id,
                    'school' => Auth::user()->userable->school,
                    'country_id' => Auth::user()->userable->country_id,
                    'region_id' => Auth::user()->userable->region_id,
                    'city_id' => Auth::user()->userable->city_id,
                    'instagram_handle' => Auth::user()->userable->instagram_handle,
                    'coins' => PlayerService::getCurrentPlayerCoins(Auth::user()),
                    'referral_link' => Auth::user()->userable->getReferralLink()
                ],
                'roles' => $user->roles->pluck('name')->toArray(),
                'countdown' => $countdown
            ],
            "Player logged in successfully"
        );
    }
}
