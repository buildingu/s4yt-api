<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Configuration;
use App\Services\PlayerService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

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
        $player = $playerService->addPlayer($validated, Configuration::getCurrentValueByKey(Configuration::REGISTER_COINS));
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
}
