<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\SendVerifyEmailRequest;
use App\Models\Configuration;
use App\Models\User;
use App\Notifications\VerifyEmail;
use App\Notifications\WelcomeEmail;
use App\Services\PlayerService;
use Illuminate\Http\Response;
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
        $player = PlayerService::addPlayer($validated, intval(Configuration::getCurrentValueByKey(Configuration::REGISTER_COINS)));
        Log::info('Player {$player->name} registered successfully.', ['id' => $player->id, 'email' => $player->user->email]);
        $player->user->notify(new VerifyEmail());
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
        if (!$request->hasValidSignature()) {
            return redirect(config('app.front_url') . '/register/verify-email');
        }

        $user = User::findOrFail($user_id);
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.front_url') . '/verify-email/bad-request');
        }

        $user->markEmailAsVerified();
        $user->notify(new WelcomeEmail());
        return redirect(config('app.front_url') . '/verify-email/success');
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

        $user->notify(new VerifyEmail());

        return $this->sendResponse(
            [],
            "Mail resend successfully"
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

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

        return $this->sendResponse(
            [
                'auth' => 'Bearer',
                'token' => $token,
                'roles' => $user->roles->pluck('name')->toArray()
            ],
            "Player logged in successfully"
        );
    }
}
