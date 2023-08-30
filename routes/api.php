<?php


use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// auth
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register'])->withoutMiddleware(['auth:api']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login'])->withoutMiddleware(['auth:api']);
Route::get('/user/current', [\App\Http\Controllers\Api\AuthController::class, 'currentUser']);
Route::get('/email/verify/{id}', [\App\Http\Controllers\Api\AuthController::class, 'verify'])->name('player.verify')->withoutMiddleware(['auth:api']);
Route::post('/email/verify', [\App\Http\Controllers\Api\AuthController::class, 'resendVerify'])->name('player.resend.verify')->withoutMiddleware(['auth:api']);
Route::post('/password-reset', [\App\Http\Controllers\Api\AuthController::class, 'passwordReset'])->name('password.reset')->withoutMiddleware(['auth:api']);

// player data endpoints
Route::get('/location/countries', [\App\Http\Controllers\Api\RegisterController::class, 'getCountries'])->withoutMiddleware(['auth:api']);
Route::get('/location/states', [\App\Http\Controllers\Api\RegisterController::class, 'getStates'])->name('location.states')->withoutMiddleware(['auth:api']);
Route::get('/location/cities', [\App\Http\Controllers\Api\RegisterController::class, 'getCities'])->name('location.cities')->withoutMiddleware(['auth:api']);
Route::get('/educations', [\App\Http\Controllers\Api\RegisterController::class, 'getEducations'])->name('education.index')->withoutMiddleware(['auth:api']);
Route::get('/grades', [\App\Http\Controllers\Api\RegisterController::class, 'getGrades'])->name('grades.index')->withoutMiddleware(['auth:api']);

/*
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);;
});
*/
