<?php

namespace Database\Factories;
use App\Models\Stokeur;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stokeur>
 */
class StokeurFactory extends Factory
{
    protected $model = Stokeur::class;
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
        ];
    }
}
