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
        Schema::create('user_sgf_fournisseurs', function (Blueprint $table) {
            $table->id(); // Clé primaire pour la table sgf_fournisseurs
            $table->unsignedBigInteger('idUser'); // Clé étrangère pour SGF
            $table->foreign('idUser')->references('idUser')->on('user_sgfs')->onDelete('cascade'); // Clé étrangère vers 'sgfs'
            $table->unsignedBigInteger('idFournisseur'); // Clé étrangère pour Fournisseur
            $table->foreign('idFournisseur')->references('id')->on('fournisseurs')->onDelete('cascade'); // Clé étrangère vers 'fournisseurs'
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
        Schema::dropIfExists('user_sgf_fournisseurs');
    }
};
