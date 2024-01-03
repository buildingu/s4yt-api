<?php

namespace Database\Factories;

use App\Models\UserVersion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coin>
 */
class CoinFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'source' => fake()->numberBetween(1,4),
            'user_version_id' => fake()->randomElement(UserVersion::all()->pluck('id')->toArray())
        ];
    }
}
