<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CamionCiterne;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BonDeLivraison>
 */
class BonDeLivraisonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idCamionCiterne' =>CamionCiterne::factory(),
            'dateLivraison' => $this->faker->date(),
            'quantite' => $this->faker->numberBetween(1, 1000), 
            'destinataire' => $this->faker->name(),
            'produit' => $this->faker->word(),
            'heure' => $this->faker->time(),
        ];
    }
}
