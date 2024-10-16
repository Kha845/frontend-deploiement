<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ModePaiement;
use App\Models\BonDeLivraison;
use App\Models\BonDeCommande;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facture>
 */
class FactureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'reference' => $this->faker->unique()->numerify('FACT-#####'),
            'emetteur' => $this->faker->name(), 
            'fournisseur' => $this->faker->name(),
            'depot' =>  $this->faker->company(), 
            'format' => $this->faker->word(),
            'designation' => $this->faker->word(), 
            'prixUnitaire' => $this->faker->randomFloat(2, 10, 1000), 
            'quantite' => $this->faker->numberBetween(1, 100), 
            'montant' => fn (array $attributes) => $attributes['prixUnitaire'] * $attributes['quantite'],  
            'date' => $this->faker->date(),  
            'etat' => $this->faker->randomElement(['payée', 'impayée', 'en cours']),  
            'idModePaiement' => ModePaiement::factory(), 
            'idBonLivraison' => BonDeLivraison::factory(),
            'idBonCommande' => BonDeCommande::factory(), 
            'taxe' => $this->faker->randomFloat(2, 0, 20), 
        ];
    }
}
