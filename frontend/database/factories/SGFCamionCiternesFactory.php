<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserSgf;
use app\Models\CamionCiterne;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SGFCamionCiternes>
 */
class SGFCamionCiternesFactory extends Factory
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
            'idCamionCiterne' => CamionCiterne::factory(),
        ];
    }
}
