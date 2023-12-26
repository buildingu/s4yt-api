<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use App\Models\Education;
use App\Models\Grade;
use App\Services\LocationService;
use App\Services\PlayerService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StorePlayerRequest;
use App\Http\Requests\UpdatePlayerRequest;
use Spatie\Permission\Models\Role;
use App\Models\Coin;
use App\Models\Player;
use App\Models\UserVersion;
use App\Services\UserService;

class PlayerController extends Controller
{

    /**
     * Display a list of the resource user.
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request) : View
    {
        $users = User::whereHas('roles', function($q) {
            $q->whereIn('name', [User::BU_PLAYER_ROLE, User::PLAYER_ROLE]);
        });

        $players = $users->paginate(20);
        return view('admin.players.index',compact('players'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param LocationService $locationService
     * @return View
     */
    public function create(LocationService $locationService): View
    {
        $educations = Education::all();
        $grades =  Grade::all();
        $countries = ($locationService->getCountries())->json();
        $roles = Role::whereIn('name', [User::PLAYER_ROLE, User::BU_PLAYER_ROLE])->get();
        return view('admin.players.create', compact('educations', 'countries', 'grades', 'roles'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StorePlayerRequest $request
     * @param PlayerService $playerService
     * @return RedirectResponse
     */
    public function store(StorePlayerRequest $request, PlayerService $playerService): RedirectResponse
    {
        $validated = $request->validated();
        $playerService->addPlayer($validated, Configuration::getValueByKey(Configuration::REGISTER_COINS), true);
        return redirect()->route('player.index')->with('success', 'Player added successfully.');
    }

    public function show($id, LocationService $locationService): View
    {
        $user = User::find($id);
        $player = $user->userable;
        $location_data = array(
            'country_iso' => $player->country_iso,
            'state_iso' => $player->state_iso,
            'city_id' => $player->city_id
        );
        $form_data = $locationService->getLocationData($location_data);
        return view('admin.players.show', compact('user', 'player', 'form_data'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdatePlayerRequest $request
     * @param $id
     * @param PlayerService $playerService
     * @return RedirectResponse
     */
    public function update(UpdatePlayerRequest $request, $id): RedirectResponse
    {
        $validated = $request->validated();
        $user = User::find($id);

        if(!$user) {
            return redirect()->route('player.index')->with('error', 'Player not found.');
        }

        if($user->email != $validated['email']) {
            $request->validate([
                'email' => 'required|string|email|unique:users',
            ]);
        }
        
        (new UserService())->update($request->only(['name','email','player']),$user);

        return redirect()->route('player.index')->with('success', 'Player updated successfully.');
    }

        /**
    * Show the form for edit a resource.
    *
    * @param $id
    * @return View
    */
    public function edit($id, LocationService $locationService): View
    {
        $user = User::find($id);
        $player = $user->userable;
        $grades = Grade::all();
        $educations = Education::all();
        $location_data = array(
            'country_iso' => $player->country_iso,
            'state_iso' => $player->state_iso,
            'city_id' => $player->city_id
        );
        $form_data = $locationService->getLocationData($location_data);
        $roles = Role::whereIn('name', [User::PLAYER_ROLE, User::BU_PLAYER_ROLE])->get();
        return view('admin.players.edit', compact('user', 'player', 'grades', 'educations', 'roles', 'form_data'));
    }

    public function destroy($id): RedirectResponse
    {
        $user = User::find($id);
        $player = $user->userable;

        if(!$player) {
            return redirect()->route('player.index')->with('error', 'Player not found.');
        }

        Coin::where('player_id', $player->id)->delete();
        UserVersion::where('user_id', $user->id)->delete();
        Player::destroy($player->id);
        User::destroy($user->id);
        return redirect()->route('player.index')->with('success', 'Player deleted successfully.');
    }
}
