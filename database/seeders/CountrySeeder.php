<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $response = Http::get(config('api.country_state_city_json_url'));
        $countries = $response->json();

        foreach ($countries as $_country) {
            $country = Country::create([
                'name' => $_country['name'],
                'iso3' => $_country['iso3'],
                'flag' => $_country['emoji']
            ]);
            foreach ($_country['states'] as $_state) {
                $state = $country->regions()->create([
                    'name' => $_state['name'],
                    'state_code' => $_state['state_code'],
                    'type' => $_state['type']
                ]);
                foreach ($_state['cities'] as $city) {
                    $state->cities()->create([
                        'name' => $city['name'],
                    ]);
                }
            }
        }
    }
}
