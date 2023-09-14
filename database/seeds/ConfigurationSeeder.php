<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $configs = [
            [
                'key' => 'register_coins',
                'description' => 'Coins given for player registration',
                'data_type_id' => 1
            ],
            [
                'key' => 'referral_coins',
                'description' => 'Coins given for player referral and registration',
                'data_type_id' => 1
            ],
            [
                'key' => 'instagram_coins',
                'description' => 'Coins given for interactions on instagram',
                'data_type_id' => 1
            ],
            [
                'key' => 'game_start',
                'description' => "Date format: mm-dd-YYYY HH:ii (" . config('app.timezone') ."). Set the time of the start at the game. At this point the student will be able to interact with the game.",
                'data_type_id' => 2
            ],
            [
                'key' => 'game_end',
                'description' => "Date format: mm-dd-YYYY HH:ii (" . config('app.timezone') . "). Set the time of the start at the game. At this point the student will no longer be able to interact with the game.",
                'data_type_id' => 2
            ],
            [
                'key' => 'winners_announced',
                'description' => "Date format: mm-dd-YYYY HH:ii (" . config('app.timezone') . "). Set the time of the start at the game. At this point the award and raffle items are chosen and the related mailing is sent.",
                'data_type_id' => 2
            ],
            [
                'key' => 'login_disabled',
                'description' => "Date format: mm-dd-YYYY HH:ii (" . config('app.timezone') . "). Set the time of the start at the game. At this point the login will be disables for students, businesses and sponsors.",
                'data_type_id' => 2
            ]
        ];

        DB::table('configurations')->insert($configs);

        $config_versions = [
            'version_id' => 1,
            'configuration_id' => 1,
            'value' => 3,
            'created_by' => (\App\Models\User::role(\App\Models\User::SUPER_ADMIN_ROLE)->first())->id
        ];

        DB::table('configuration_version')->insert($config_versions);
    }
}
