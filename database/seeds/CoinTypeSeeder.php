<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\CoinType;

class CoinTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        collect(['register','referral','instagram'])->map(function($name){
            CoinType::firstOrCreate([
                'event'=>$name
            ]);
        });
    }
}
