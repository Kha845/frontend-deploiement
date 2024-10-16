<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('camion_citernes', function (Blueprint $table) {
            $table->id();  // Clé primaire 'id'
            $table->string('immat');
            $table->string('nomChauffeur');
            $table->integer('nombreCompartiment');
            $table->decimal('volumeCompartiment', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('camion_citernes');
    }
};
