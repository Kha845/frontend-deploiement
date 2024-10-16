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
        Schema::create('user_sgf_clients', function (Blueprint $table) {
            $table->id(); // Clé primaire pour 'sgf_clients'
            $table->unsignedBigInteger('idUser'); // Colonne 'idUser' de type unsignedBigInteger
            $table->foreign('idUser')->references('idUser')->on('users')->onDelete('cascade'); // Clé étrangère vers 'sgfs'
            
            $table->unsignedBigInteger('idClient'); // Colonne 'idClient' de type unsignedBigInteger
            $table->foreign('idClient')->references('idClient')->on('clients')->onDelete('cascade'); // Clé étrangère vers 'clients'
            
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
        Schema::dropIfExists('user_sgf_clients');
    }
};
