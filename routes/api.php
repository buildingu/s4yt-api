<?php


use App\Http\Controllers\Api\InstagramController;
use App\Http\Controllers\Api\RaffleItemController;
use App\Http\Controllers\Api\RafflePartnerController;
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

//user
Route::post('/user',[\App\Http\Controllers\Api\UserController::class,'store'])->withoutMiddleware(['auth:api'])->name('user.store');
Route::put('/user/{user}',[\App\Http\Controllers\Api\UserController::class,'update']);
Route::get('/user/current',[\App\Http\Controllers\Api\UserController::class,'current']);

//resources
Route::get('sponsor',Api\SponsorPartnerController::class)->withoutMiddleware(['auth:api']);
Route::resource('referral',Api\ReferralController::class);
Route::resource('cointype',Api\CoinTypeController::class)->only('index');
Route::resource('configuration',Api\ConfigurationController::class)->withoutMiddleware(['auth:api'])->only('index');

Route::get('raffle-partners',[RafflePartnerController::class,'index']);
Route::get('raffle-partners/{id}',[RafflePartnerController::class,'show']);
Route::get('raffle-items',[RaffleItemController::class,'index']);
Route::get('raffle-items/{id}',[RaffleItemController::class,'show']);

// auth
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login'])->withoutMiddleware(['auth:api']);
Route::get('/email/verify/{id}', [\App\Http\Controllers\Api\AuthController::class, 'verify'])->name('player.verify')->withoutMiddleware(['auth:api']);
Route::post('/email/verify', [\App\Http\Controllers\Api\AuthController::class, 'resendVerify'])->name('player.resend.verify')->withoutMiddleware(['auth:api']);
Route::post('/password-reset', [\App\Http\Controllers\Api\AuthController::class, 'passwordReset'])->name('password.reset')->withoutMiddleware(['auth:api']);

// player data endpoints
Route::get('/location/countries', [\App\Http\Controllers\Api\RegisterController::class, 'getCountries'])->withoutMiddleware(['auth:api']);
Route::get('/location/states', [\App\Http\Controllers\Api\RegisterController::class, 'getStates'])->withoutMiddleware(['auth:api'])->name('location.states');
Route::get('/location/cities', [\App\Http\Controllers\Api\RegisterController::class, 'getCities'])->withoutMiddleware(['auth:api'])->name('location.cities');;
Route::get('/educations', [\App\Http\Controllers\Api\RegisterController::class, 'getEducations'])->withoutMiddleware(['auth:api']);
Route::get('/grades', [\App\Http\Controllers\Api\RegisterController::class, 'getGrades'])->withoutMiddleware(['auth:api']);

// instagram reward suggestions
Route::get('/social-media/instagram',[InstagramController::class,'getPosts']);
