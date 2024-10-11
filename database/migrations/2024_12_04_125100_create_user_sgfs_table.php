<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_sgfs', function (Blueprint $table) {
            $table->id('idUser'); // Utilisation de 'idSGF' comme clé primaire
            $table->string('prenom');
            $table->string('nom');
            $table->string('adresseSGF');
            $table->string('telephone');
            $table->string('email');
            $table->string('password');
            $table->string('matricule');
            $table->string('poste');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_sgfs');
    }
};
