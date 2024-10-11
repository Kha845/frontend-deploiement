<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GarageAutomobile>
 */
class GarageAutomobileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idClient' => Client::factory(),
            'nom_garage' => $this->faker->company(),
            'ChefGarage' => $this->faker->lastName(), 
            'adresse_garage' => $this->faker->address(),
        ];
    }
}
