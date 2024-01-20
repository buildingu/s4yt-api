<?php

namespace Database\Seeders;

use App\Models\Configuration;
use App\Models\User;
use App\Services\ConfigurationService;
use App\Services\PlayerService;
use Illuminate\Database\Seeder;

class BackupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $partials = [
            ['name' => 'Euiseok Jung', 'email' => 'dannyjung0109@gmail.com'],
            ['name' => 'Pranavi Anasuri', 'email' => 'shriya.anasuri@gmail.com'],
            ['name' => 'Shreya Jain', 'email' => 'shreyaanjili@gmail.com'],
            ['name' => 'Ava Jerman', 'email' => 'avagracejerman@icloud.com'],
            ['name' => 'Davin Patel', 'email' => 'davin.hpatel@gmail.com'],
            ['name' => 'Mihir Maringanti', 'email' => 'maringanti.mihir@gmail.com'],
            ['name' => 'Sai Kodal', 'email' => 'kodali.sai07@gmail.com'],
            ['name' => 'Andy Xu', 'email' => 'xuyuchen100@gmail.com'],
            ['name' => 'Ameena Wang', 'email' => 'ameenawang520@gmail.com'],
            ['name' => 'Yukta Pandiri', 'email' => 'pandiriy@bentonvilek12.org'],
            ['name' => 'Katelyn Tran', 'email' => 'kateyi.tran@gmail.co'],
            ['name' => 'Yukta Pandiri', 'email' => 'pandiriyukta@gmail.com'],
            ['name' => 'Ritika Tyagi', 'email' => 'ritika.tyagi8392@gmail.cim'],
            ['name' => 'Benjamin Dao', 'email' => 'bdao7864@gmail.com'],
            ['name' => 'Ryan Yin', 'email' => 'Ryanyin360@gmail.com'],
            ['name' => 'Sofia Xu', 'email' => 'xuyikka9@gmail.com'],
            ['name' => 'Ananya Anand', 'email' => 'ananya.anand44@gmail.com'],
            ['name' => 'Kelci Battey', 'email' => 'kelcibattey@yahoo.com'],
            ['name' => 'Ritika Tyagi', 'email' => 'ritika.tyagi8392@gmail.com'],
            ['name' => 'Shrey Shori', 'email' => 'shreyshori@gmail.com'],
            ['name' => 'Amirali Khoshneviszadeh', 'email' => 'amirali-kh@live.com'],
            ['name' => 'Destiny Arroyo', 'email' => 'destinyarroyo25@icloud.com'],
            ['name' => 'Pranathi Valluripalli', 'email' => '64003052@ep-student.org'],
            ['name' => 'Jason Luo', 'email' => 'cooljason888@gmail.com'],
            ['name' => 'Dev Singh', 'email' => 'devvrats007@gmail.com'],
            ['name' => 'Varshini Muppa', 'email' => 'srisanmuppa@gmail.com'],
            ['name' => 'Meghana Kumar', 'email' => 'wereghanabeatyou@gmail.com'],
            ['name' => 'Amy Feng', 'email' => 'amyjrfeng@gmail.com'],
            ['name' => 'Asmi', 'email' => 'asmikadam2009@gmail.com'],
            ['name' => 'Xin Han Shao', 'email' => 'xshao1004@gmail.com']
        ];

        $completes = [
            [
                'name' => 'Ginny Feng',
                'email' => 'ginnyfengdog@gmail.com',
                'grade_id' => 3,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4893,
                'city_id' => 14550
            ],
            [
                'name' => 'Pranav Boreddy',
                'email' => 'pranav.boreddy@gmail.com',
                'grade_id' => 2,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4866,
                'city_id' => 13671
            ],
            [
                'name' => 'Tiffany Nguyen',
                'email' => 'tkhatu06@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4845,
                'city_id' => 130729
            ],
            [
                'name' => 'Phu Nguyen',
                'email' => 'giaphung0804@gmail.com',
                'grade_id' => 2,
                'education_id' => 1,
                'country_id' => 39,
                'region_id' => 654,
                'city_id' => 16975
            ],
            [
                'name' => 'Owen Feng',
                'email' => 'owenfengmouse@gmail.com',
                'grade_id' => 3,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4893,
                'city_id' => 14550
            ],
            [
                'name' => 'Luna Saldana',
                'email' => 'luna.saldanalopez@gmail.com',
                'grade_id' => 3,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4846,
                'city_id' => 13168
            ],
            [
                'name' => 'Layan Essam',
                'email' => 'layanessam69@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'country_id' => 217,
                'region_id' => 4105,
                'city_id' => 12040
            ],
            [
                'name' => 'Janghee Lee',
                'email' => 'janghee3000@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4880,
                'city_id' => 14156
            ],
            [
                'name' => 'Nicole Zhang',
                'email' => 'nicolexzha@gmail.com',
                'grade_id' => 3,
                'education_id' => 1,
                'country_id' => 39,
                'region_id' => 654,
                'city_id' => 1692
            ],
            [
                'name' => 'Yogith',
                'email' => 'lyogith@gmail.com',
                'grade_id' => 3,
                'education_id' => 1,
                'country_id' => 236,
                'region_id' => 4894,
                'city_id' => 145878
            ],
            [
                'name' => 'Ulzhan',
                'email' => 'ulzhann12@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'country_id' => 113,
                'region_id' => 1991,
                'city_id' => 65374
            ],
            [
                'name' => 'Rishi Venkata Bollapalli',
                'email' => 'bollapalli.rishi@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'country_id' => 236,
	            'region_id' => 4881,
	            'city_id' => 141690
            ],
            [
                'name' => 'Unnat Ghura',
                'email' => 'unnatpreet15@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'school' => 'Fremd High School',
                'country_id' => 236,
                'region_id' => 4856,
                'city_id' => 134267
            ],
            [
                'name' => 'Sabreen A Hamayel',
                'email' => '20shamayel08@gmail.com',
                'grade_id' => 3,
                'education_id' => 1,
                'school' => 'Universal School',
                'country_id' => 236,
                'region_id' => 4856,
                'city_id' => 133674
            ],
            [
                'name' => 'Sabreen A Hamayel',
                'email' => '25sahamayel@st.universalschool.org',
                'grade_id' => 3,
                'education_id' => 1,
                'school' => 'Universal School',
                'country_id' => 236,
                'region_id' => 4856,
                'city_id' => 133674
            ],
            [
                'name' => 'Aarav Mohite',
                'email' => 'aaravmohite2@gmail.com',
                'grade_id' => 2,
                'education_id' => 1,
                'school' => 'WHS',
                'country_id' => 236,
                'region_id' => 4845,
                'city_id' => 131185
            ],
            [
                'name' => 'Sagar Lamichhane',
                'email' => 'lamichhanesagar1117@gmail.com',
                'grade_id' => 4,
                'education_id' => 1,
                'school' => 'WHS',
                'country_id' => 236,
                'region_id' => 4894,
                'city_id' => 146173
            ],
            [
                'name' => 'Noah Wolter',
                'email' => 'noahinkyoto@gmail.com',
                'grade_id' => 2,
                'education_id' => 1,
                'school' => 'Kyoto International University Academy',
                'country_id' => 110,
                'region_id' => 1940,
                'city_id' => 64319
            ]
        ];

        foreach ($partials as $partial) {
            $partial['is_backup'] = true;
            $partial['profile_updated'] = false;
            $partial['password_updated'] = false;
            $partial['role'] = User::PLAYER_ROLE;
            PlayerService::addPlayer(
                $partial,
                intval(ConfigurationService::getCurrentValueByKey(Configuration::REGISTER_COINS)),
                true,
                true
            );
        }

        foreach ($completes as $complete) {
            $complete['is_backup'] = true;
            $complete['profile_updated'] = true;
            $complete['password_updated'] = false;
            $complete['role'] = User::PLAYER_ROLE;
            PlayerService::addPlayer(
                $complete,
                intval(ConfigurationService::getCurrentValueByKey(Configuration::REGISTER_COINS)),
                false,
                true
            );
        }
    }
}
