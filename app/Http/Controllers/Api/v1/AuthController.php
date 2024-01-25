<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\SendVerifyEmailRequest;
use App\Models\Configuration;
use App\Models\User;
use App\Models\Version;
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
        // validate request
        $validated = $request->validated();
        // check version if any
        if(isset($validated['version_id']) && $validated['version_id'] !== Version::currentVersionId()) {
            return $this->sendError("Version not valid", [], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        // register player in database
        $user = PlayerService::addPlayer(
            $validated,
            intval(ConfigurationService::getCurrentValueByKey(Configuration::REGISTER_COINS))
        );
        // log process
        Log::info('Player {$player->name} registered successfully.', ['id' => $user->id, 'email' => $user->email]);
        // send response
        return $this->sendResponse(
            [
                'uuid' => $user->id,
                'email' => $user->email
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
            Log::info('Player {$player->name} verify email sent successfully.', ['id' => $user->id, 'email' => $user->email]);
            return redirect(config('app.front_url') . '/register/verify-email/success');
        }

        if (!$request->hasValidSignature()) {
            return redirect(config('app.front_url') . '/register/verify-email');
        }

        $user->markEmailAsVerified();
        $user->notify((new WelcomeEmail())->delay(now()->addMinute()));
        Log::info('Player {$player->name} verify email sent successfully.', ['id' => $user->id, 'email' => $user->email]);
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
        Log::info('Player {$player->name} verify email sent successfully.', ['id' => $user->id, 'email' => $user->email]);

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
        Log::info('Player {$player->name} reset password sent successfully.', ['id' => $user->id, 'email' => $user->email]);

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

        Log::info('Player {$player->name} logged in successfully.', ['id' => $user->id, 'email' => $user->email]);
        $token = auth()->user()->createToken(env('APP_NAME'))->accessToken;
        $countdown  =Carbon::now() < $timestamps['game_start'] ?
            "The game has not started yet" :
            (Carbon::now() > $timestamps['review_end'] ?
                "The game has ended" :
                VersionService::getCountdown($timestamps['review_start'], Carbon::now())
                );

        return $this->sendResponse(
            [
                'auth' => 'Bearer',
                'token' => $token,
                'user' => [
                    'email' => Auth::user()->email,
                    'name' =>  Auth::user()->name,
                    'grade_id' => Auth::user()->userable->grade_id ?? null,
                    'education_id' => Auth::user()->userable->education_id ?? null,
                    'school' => Auth::user()->userable->school ?? "",
                    'country_id' => Auth::user()->userable->country_id ?? null,
                    'region_id' => Auth::user()->userable->region_id ?? null,
                    'city_id' => Auth::user()->userable->city_id ?? null,
                    'instagram_handle' => Auth::user()->userable->instagram_handle ?? null,
                    'coins' => PlayerService::getCurrentPlayerCoins(Auth::user()),
                    'referral_link' => Auth::user()->userable ? Auth::user()->userable->getReferralLink() : "",
                    'roles' => $user->roles->pluck('name')->toArray(),
                ],
                'countdown' => $countdown,
                'timestamps' => $timestamps
            ],
            "Player logged in successfully"
        );
    }
}
