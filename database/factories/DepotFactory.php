<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Depot;
use App\Models\Stokeur;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Depot>
 */
class DepotFactory extends Factory
{
    protected $model = Depot::class;
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
            'idStokeur' => Stokeur::factory(), // Associe automatiquement un Stokeur généré
        ];
    }
}
