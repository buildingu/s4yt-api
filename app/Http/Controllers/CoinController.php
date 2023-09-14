<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\CreateCoinRequest;
use App\Services\CoinDescriptionService;
use App\Models\user;
use App\Models\Coin;
use App\Models\CoinType;

class CoinController extends Controller
{

    /**
     * Display a list of the resource user.
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request, String $id) : View
    {
        $user = User::find($id);
        $player = $user->userable;
        $coins = Coin::where('player_id',$player->id)->paginate(25);

        return view('admin.coin.index',compact('coins','user'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @param LocationService $locationService
     * @return View
     */
    public function create(Request $request, String $id): View
    {
        $user = User::find($id);
        $coinTypes = CoinType::all();

        return view('admin.coin.create',compact('user','coinTypes'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StorePlayerRequest $request
     * @param PlayerService $playerService
     * @return RedirectResponse
     */
    public function store(CreateCoinRequest $request, String $id): RedirectResponse
    {
        $user = User::find($id);
        $description = $request->has('description') ? (new CoinDescriptionService())->create($request->input('description')) : null;

        factory(Coin::class,(int) $request->input('amount'))->create($description ? [
            'player_id' => $user->userable->id,
            'coin_type_id' => (int) $request->input('type'),
            'coin_description_id' => $description->id,
        ] : [
            'player_id' => $user->userable->id,
            'coin_type_id' => (int) $request->input('type')
        ]);

        return redirect()->route('coin.index',['player'=>$id])->with('success', 'Coin(s) added successfully.');
    }

    public function show($id): View
    {
        
    }

    public function destroy($userId,$coinId): RedirectResponse
    {
        $user = User::find($userId);
        $coin = Coin::find($coinId);

        if($coin->player_id == $user->userable->id){
            $coin->delete();
        }

        return redirect()->route('coin.index',['player'=>$userId])->with('success', 'Coin deleted successfully.');
    }
}
