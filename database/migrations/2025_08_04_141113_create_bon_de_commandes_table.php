<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bon_de_commandes', function (Blueprint $table) {
            $table->id();
            $table->string('emetteur');
            $table->date('date');
            $table->integer('quantite');
            $table->string('UniteDeMesure')->default('littre');
            $table->string('produit');
            $table->time('heure');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bon_de_commandes');
    }
};
