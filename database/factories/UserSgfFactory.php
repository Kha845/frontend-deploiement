<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserSgf>
 */
class UserSgfFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idUser' => $this->faker->unique()->numberBetween(1, 1000),
            'prenom' => $this->faker->firstName(),
            'nom' => $this->faker->lastName(),
            'adresseSGF' => $this->faker->address(),
            'telephone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'), // Vous pouvez changer le mot de passe par défaut
            'matricule' => $this->faker->unique()->word(),
            'poste' => $this->faker->jobTitle(),
        ];
    }
}
