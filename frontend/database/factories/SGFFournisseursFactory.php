<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserSgf;
use App\Models\Fournisseur;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SGFFournisseurs>
 */
class SGFFournisseursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idUser' => UserSgf::factory(),
            'idFournisseur' => Fournisseur::factory()
        ];
    }
}
