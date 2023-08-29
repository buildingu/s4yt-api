<?php

namespace App\Http\Controllers\Api;

use App\Models\Configuration;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResendVerifyRequest;
use App\Notifications\VerifyEmail;
use App\Notifications\WelcomeEmail;
use App\Services\PlayerService;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Method registers new player
     * @param RegisterRequest $request
     * @param PlayerService $playerService
     * @return JsonResponse
     */
    public function register(RegisterRequest $request, PlayerService $playerService): JsonResponse
    {
        $validated = $request->validated();
        $player = $playerService->addPlayer($validated, Configuration::getValueByKey(Configuration::REGISTER_COINS));

        Log::info('Player {$player->name} registered successfully.', ['id' => $player->id, 'email' => $player->email]);

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

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->sendError('Player not registered', [], Response::HTTP_NOT_FOUND);
        }

        if(!$user->hasVerifiedEmail()) {
            return $this->sendError('Player does not have validated email', [], Response::HTTP_UNAUTHORIZED);
        }

        if (!auth()->attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return $this->sendError('Credentials not valid', [], Response::HTTP_UNAUTHORIZED);
        }
       
        $token = (Auth::user())->createToken(env('APP_NAME'))->accessToken;

        return $this->sendResponse(
            [
                'auth' => 'Bearer',
                'token' => $token,
            ],
            "Player logged in successfully"
        );
    }

    public function logout(): JsonResponse
    {
        auth()->user()->tokens()->delete();

        return $this->sendResponse(
            null,
            "Player logged out successfully"
        );
    }

    /**
     * @param $user_id
     * @param Request $request
     * @return RedirectResponse
     */
    public function verify($user_id, Request $request) : RedirectResponse
    {
        if (!$request->hasValidSignature()) {
            return redirect(config('app.front_url') . '/login');
        }

        $user = User::findOrFail($user_id);
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.front_url') . '/login');
        }

        $user->markEmailAsVerified();
        $user->notify(new WelcomeEmail());
        return redirect(config('app.front_url') . '/login');
    }

    public function resendVerify(ResendVerifyRequest $request) : JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->sendError('Player not registered', [], Response::HTTP_NOT_FOUND);
        }

        $user->notify(new VerifyEmail());

        return $this->sendResponse(
            [],
            "Mail resend successfully"
        );
    }
}
