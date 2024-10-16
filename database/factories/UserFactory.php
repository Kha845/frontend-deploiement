<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;



/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
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
            'role_id' => Role::factory(),
            'poste' => $this->faker->jobTitle(),
            'etat' => false,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
