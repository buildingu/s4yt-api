<?php

namespace Database\Seeders;

use App\Models\Configuration;
use App\Models\ConfigurationDataType;
use App\Models\User;
use App\Models\Version;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configs = [
            [
                'key' => 'register_coins',
                'description' => 'Coins given for player registration',
                'configuration_data_type_id' => ConfigurationDataType::getIdBySlug(ConfigurationDataType::INTEGER)
            ],
            [
                'key' => 'referral_coins',
                'description' => 'Coins given for player referrals',
                'configuration_data_type_id' =>  ConfigurationDataType::getIdBySlug(ConfigurationDataType::INTEGER)
            ],
            [
                'key' => 'instagram_coins',
                'description' => 'Coins given for interactions on instagram',
                'configuration_data_type_id' =>  ConfigurationDataType::getIdBySlug(ConfigurationDataType::INTEGER)
            ],
            [
                'key' => 'register_start',
                'description' => "Date format: Y-m-d H:i (" . config('app.timezone') ."). Set the time of the start at the game. At this point the student will be able to interact with the game.",
                'configuration_data_type_id' =>  ConfigurationDataType::getIdBySlug(ConfigurationDataType::DATE)
            ],
            [
                'key' => 'game_start',
                'description' => "Date format: Y-m-d H:i (" . config('app.timezone') ."). Set the time of the start at the game. At this point the student will be able to interact with the game.",
                'configuration_data_type_id' =>  ConfigurationDataType::getIdBySlug(ConfigurationDataType::DATE)
            ],
            [
                'key' => 'review_start',
                'description' => "Date format: Y-m-d H:i (" . config('app.timezone') . "). Set the time of the start at the game. At this point the student will no longer be able to interact with the game.",
                'configuration_data_type_id' => ConfigurationDataType::getIdBySlug(ConfigurationDataType::DATE)
            ],
            [
                'key' => 'review_end',
                'description' => "Date format: Y-m-d H:i (" . config('app.timezone') . "). Set the time of the start at the game. At this point the award and raffle items are chosen and the related mailing is sent.",
                'configuration_data_type_id' => ConfigurationDataType::getIdBySlug(ConfigurationDataType::DATE)
            ],
            [
                'key' => 'game_end',
                'description' => "Date format: Y-m-d H:i (" . config('app.timezone') . "). Set the time of the start at the game. At this point the login will be disables for students, businesses and sponsors.",
                'configuration_data_type_id' => ConfigurationDataType::getIdBySlug(ConfigurationDataType::DATE)
            ]
        ];

        DB::table('configurations')->insert($configs);

        $current_version_id = Version::currentVersionId();
        $super_admin = User::getSuperAdminUser();

        Configuration::getConfigurationByKey(Configuration::REGISTER_COINS)->versions()->attach($current_version_id, [
            'value' => 3,
            'created_by' => $super_admin->id
        ]);

        Configuration::getConfigurationByKey(Configuration::REFERRAL_COINS)->versions()->attach($current_version_id, [
            'value' => 5,
            'created_by' => $super_admin->id
        ]);

        Configuration::getConfigurationByKey(Configuration::INSTAGRAM_COINS)->versions()->attach($current_version_id, [
            'value' => 3,
            'created_by' => $super_admin->id
        ]);
    }
}
