<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\models\UserSgf;
use App\models\Stokeur;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SGFStockeurs>
 */
class SGFStockeursFactory extends Factory
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
            'idStokeur' => Stokeur::factory()
        ];
    }
}
