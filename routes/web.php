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

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified'
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
    Route::get('/versions', App\Http\Livewire\VersionModule::class)->name('versions')->middleware(['role:admin|super_admin']);
    Route::get('/configurations', App\Http\Livewire\ConfigurationModule::class)->name('configurations')->middleware(['role:super_admin']);
    Route::get('/event-partners', App\Http\Livewire\EventPartnerModule::class)->name('event.partners')->middleware(['role:super_admin|admin']);
    Route::get('/raffle-partners', App\Http\Livewire\RafflePartnerModule::class)->name('raffle.partners')->middleware(['role:super_admin|admin']);
    Route::get('/raffle-partners/{id}', App\Http\Livewire\RaffleAreaModule::class)->name('raffle.area')->middleware(['role:super_admin|admin|raffle_partner']);
});
