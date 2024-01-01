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
    Route::post('/register', [\App\Http\Controllers\Api\v1\AuthController::class, 'register']);
    Route::get('/email/verify/{id}', [\App\Http\Controllers\Api\v1\AuthController::class, 'verify'])->name('player.verify');
    Route::post('/email/verify', [\App\Http\Controllers\Api\v1\AuthController::class, 'sendVerifyEmail'])->name('send.verify');
});
