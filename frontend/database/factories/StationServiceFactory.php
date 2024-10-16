<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\StationService;
use App\Models\Client;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StationService>
 */
class StationServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idStation'=>$this->faker->unique()->numberBetween(1, 1000),
            'idClient' => Client::factory(),  
            'gerant' => $this->faker->name(), 
            'responsable' => $this->faker->name(), 
            'nombreDePompe' => $this->faker->numberBetween(1, 1000),
        ];
    }
}
