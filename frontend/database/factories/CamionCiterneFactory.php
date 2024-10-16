<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CamionCiterne>
 */
class CamionCiterneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'immat' => $this->faker->unique()->numberBetween(1, 1000),  // Immatriculation unique du camion
            'nomChauffeur' => $this->faker->name(),  
            'nombreCompartiment' => $this->faker->numberBetween(1, 100),
            'volumeCompartiment' => $this->faker->randomFloat(2, 1000, 20000),
        ];
    }
}
