<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Boulangerie>
 */
class BoulangerieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idClient' => Client::factory(),  // Associe automatiquement un client généré
            'responsable' => $this->faker->name(), 
        ];
    }
}
