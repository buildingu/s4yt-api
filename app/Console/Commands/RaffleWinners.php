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
                $coins = Coin::where('raffle_item_version_id', $raffle_item_version->pivot->id)->whereNotIn('id', $winner_coin_ids);
                $coins_count = $coins->count();
                if($coins_count > 0 && $raffle_item_version->pivot->stock > 0) {
                    for($i = 1; $i<= $raffle_item_version->pivot->stock && $i <= $coins_count; $i++) {
                        $this->line('Processing stock unit ' . $i . '/' .  $raffle_item_version->pivot->stock);
                        $chances = $this->getChances($coins, $coins_count);
                        $this->line(json_encode($chances));
                        $this->line(json_encode(array('raffle_item_id' => $raffle_item->id, 'count' => $coins_count)));

                    }

                }
            }

        } else {
            $this->line('Raffle winners already assigned.');
        }
    }

    private function getChances($coins, $coins_count): array
    {
        $coins_by_users = $coins->select(DB::raw('count(*) as coin_count, user_version_id'))->groupBy('user_version_id')->get();
        $chances = [];
        foreach ($coins_by_users as $coins_by_user) {
            $chances[] = [
                'user_version_id' => $coins_by_user->user_version_id,
                'chance' => $coins_by_user->coin_count/$coins_count
            ];
        }
        return $chances;
    }
}
