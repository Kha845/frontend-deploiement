<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('garage_automobiles', function (Blueprint $table) {
        $table->id(); // Clé primaire par défaut
        $table->unsignedBigInteger('idClient'); // Clé étrangère sur 'idClient'
        $table->foreign('idClient')->references('idClient')->on('clients')->onDelete('cascade'); // Référence explicite à la clé primaire 'idClient'
        $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('garage_automobiles');
    }
};
