<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('station_services', function (Blueprint $table) {
            $table->id('idStation');
            // Utilisation de foreignId pour la clé étrangère vers 'clients', et spécification de 'idClient'
            $table->foreignId('idClient')->constrained('clients', 'idClient')->onDelete('cascade');
            $table->string('gerant');
            $table->string('responsable');
            $table->integer('nombreDePompe');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('station_services');
    }
};
