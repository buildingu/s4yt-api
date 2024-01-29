<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    //auth
    Route::post('/register', [\App\Http\Controllers\Api\v1\AuthController::class, 'register']);
    Route::get('/email/verify/{id}', [\App\Http\Controllers\Api\v1\AuthController::class, 'verify'])->name('player.verify');
    Route::post('/email/verify', [\App\Http\Controllers\Api\v1\AuthController::class, 'sendVerifyEmail'])->name('send.verify');
    Route::get('/email/reset/{id}', [\App\Http\Controllers\Api\v1\AuthController::class, 'resetPassword'])->name('player.reset');
    Route::post('/email/reset', [\App\Http\Controllers\Api\v1\AuthController::class, 'sendResetPasswordEmail'])->name('send.reset');
    Route::patch('/password', [\App\Http\Controllers\Api\v1\PlayerController::class, 'resetPassword']);
    Route::post('/login', [\App\Http\Controllers\Api\v1\AuthController::class, 'login']);
    //location
    Route::get('/countries',[\App\Http\Controllers\Api\v1\LocationController::class, 'getCountries'] );
    Route::post('/regions',[\App\Http\Controllers\Api\v1\LocationController::class, 'getRegions'] );
    Route::post('/cities',[\App\Http\Controllers\Api\v1\LocationController::class, 'getCities'] );
    //player
    Route::get('/education', [\App\Http\Controllers\Api\v1\PlayerController::class, 'getEducation']);
    Route::get('/grades', [\App\Http\Controllers\Api\v1\PlayerController::class, 'getGrades']);

    Route::middleware(['auth:api', 'verified'])->group(function () {
        Route::patch('/player/password', [\App\Http\Controllers\Api\v1\PlayerController::class, 'updatePassword']);
        Route::get('/player/coins', [\App\Http\Controllers\Api\v1\PlayerController::class, 'getCoinsDetails']);
        Route::get('/player/referrals', [\App\Http\Controllers\Api\v1\PlayerController::class, 'getReferrals']);
        Route::post('/player/profile', [\App\Http\Controllers\Api\v1\PlayerController::class, 'updateProfile']);
        Route::get('/raffle', [\App\Http\Controllers\Api\v1\RaffleController::class, 'getRaffleItems']);
        Route::post('/raffle/coins', [\App\Http\Controllers\Api\v1\RaffleController::class, 'setRaffleCoins']);
    });
});
