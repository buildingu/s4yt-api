<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->prefix('/admin')->group(function () {
    Route::view('/', 'admin');
    Route::resource('player', 'PlayerController');
    Route::resource('player/{player}/coin', 'CoinController')->only(['index','create','store','destroy']);
    Route::resource('sponsor', 'SponsorController');
    Route::resource('configuration', 'ConfigurationController', [ 'only' => ['index', 'edit', 'update']] );
});

Route::middleware('auth')->group(function() {
    Route::get('referral', [App\Http\Controllers\Api\ProfileController::class, 'getReferral']);
});
