<?php

namespace App\Console\Commands;

use App\Models\Coin;
use App\Models\RaffleItem;
use App\Models\RaffleWinner;
use App\Models\Version;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RaffleWinners extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'raffle:winners';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command set raffle winners for the current version';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle() : void
    {
        if(RaffleWinner::count() == 0) {

            // global variables
            $current_version_id = Version::currentVersionId();
            $winner_coin_ids = [];

            // get raffle items
            $raffle_items = RaffleItem::whereHas('versions', function($q) use ($current_version_id){
                $q->where('version_id', $current_version_id);
            })->where('active', true)->get();

            // loop items
            foreach ($raffle_items as $raffle_item) {
                $raffle_item_version =  $raffle_item->versions()->withPivot(['id','stock', 'active'])->wherePivot('version_id', $current_version_id)->first();
                $coins = Coin::getRaffleItemCoins($raffle_item_version->pivot->id, $winner_coin_ids);
                $coins_count = $coins->count();
                if($coins_count > 0 && $raffle_item_version->pivot->stock > 0) {
                    // loop stock or coins assigned to the item
                    for($i = 1; $i<= $raffle_item_version->pivot->stock && $i <= $coins_count; $i++) {
                        $coins_count =  Coin::getRaffleItemCoins($raffle_item_version->pivot->id, $winner_coin_ids)->count();
                        $this->line('Processing stock unit ' . $i . '/' .  $raffle_item_version->pivot->stock);
                        $chances = $this->getNormalizedChances($raffle_item_version->pivot->id, $winner_coin_ids, $coins_count);
                        $this->line(json_encode(array('raffle_item_id' => $raffle_item->id, 'count' => $coins_count)));
                        $this->line(json_encode($chances));
                        $random_chance = round(rand(0,100)/100, 2);
                        $this->line("Random => " . $random_chance);
                        $selected_chance = null;
                        foreach ($chances as $chance) {
                            if($random_chance < $chance['chance']){
                                $selected_chance = $chance;
                                break;
                            }
                        }
                        $this->line('selected_chance' . json_encode($selected_chance));
                        $selected_coin = Coin::getRaffleItemCoins($raffle_item_version->pivot->id, $winner_coin_ids, $selected_chance['user_version_id']);
                        $this->line('get single coin ' . json_encode($selected_coin->id));
                        $winner_coin_ids[] = $selected_coin->id;
                        $this->line('winner_coins ' . json_encode($winner_coin_ids));
                    }
                }
            }
        } else {
            $this->line('Raffle winners already assigned.');
        }
    }

    private function getChances($raffle_item_version_id, $winner_coin_ids, $coins_count): array
    {
        $coins_by_users = Coin::getRaffleItemCoins($raffle_item_version_id, $winner_coin_ids)->select(DB::raw('count(*) as coin_count, user_version_id'))->groupBy('user_version_id')->get();
        $this->line('coins_by_users => ' . json_encode($coins_by_users));
        $chances = [];
        foreach ($coins_by_users as $coins_by_user) {
            $chances[] = [
                'user_version_id' => $coins_by_user->user_version_id,
                'chance' => round($coins_by_user->coin_count/$coins_count, 2)
            ];
        }
        return $chances;
    }

    private function getNormalizedChances($raffle_item_version_id, $winner_coin_ids, $coins_count): array
    {
        $chances = $this->getChances($raffle_item_version_id, $winner_coin_ids, $coins_count);

        $this->line('chances => ' . json_encode($chances));

        if(sizeof($chances) > 1) {
            usort($chances, function($a, $b) {
                return $a['chance'] < $b['chance'];
            });
            $normalized_chances = [];
            for($i = 0; $i <sizeof($chances); $i++) {
                $normalized_chances[] = [
                    'user_version_id' => $chances[$i]['user_version_id'],
                    'chance' => round($i == 0 ? $chances[$i]['chance'] : $chances[$i]['chance'] + $normalized_chances[$i-1]['chance'], 2)
                ];
            }
        } else {
            $normalized_chances = $chances;
        }
        return $normalized_chances;
    }
}
