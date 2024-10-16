<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BonDeCommande>
 */
class BonDeCommandeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'emetteur' => $this->faker->name(), 
            'date' => $this->faker->date(), 
            'quantite' => $this->faker->numberBetween(1, 100),  
            'format' => $this->faker->word(),  
            'produit' => $this->faker->word(),
            'heure' => $this->faker->time(), 
        ];
    }
}
