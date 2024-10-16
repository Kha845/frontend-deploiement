<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('depots', function (Blueprint $table) {
            $table->id('idDepot'); // Clé primaire 'idDepot'
            $table->string('nom');
            $table->string('adresse');
            $table->unsignedBigInteger('idStokeur'); // Colonne clé étrangère 'idStokeur'
            
            // Clé étrangère vers 'idStokeur' dans la table 'stokeurs'
            $table->foreign('idStokeur')
                  ->references('idStokeur') // Doit correspondre à la colonne 'idStokeur' de la table 'stokeurs'
                  ->on('stokeurs')
                  ->onDelete('cascade'); // Suppression en cascade
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('depots');
    }
};
