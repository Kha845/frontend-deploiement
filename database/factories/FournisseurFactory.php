<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Fournisseur;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fournisseur>
 */
class FournisseurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'nom' => $this->faker->company(), // Génère un nom d'entreprise
            'adresse' => $this->faker->address(), // Génère une adresse aléatoire
            'telephone' => $this->faker->phoneNumber(), // Génère un numéro de téléphone
            'email' => $this->faker->unique()->safeEmail()
        ];
    }
}
