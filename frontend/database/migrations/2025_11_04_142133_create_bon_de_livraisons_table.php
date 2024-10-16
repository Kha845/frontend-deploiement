<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bon_de_livraisons', function (Blueprint $table) {
            $table->id();  // clé primaire
        $table->foreignId('idCamionCiterne')  // Utilise la clé étrangère
              ->constrained('camion_citernes')  // Référence la clé primaire 'id' de 'camion_citernes'
              ->onDelete('cascade');
        $table->date('dateLivraison');
        $table->integer('quantite');
        $table->string('UniteDeMesure')->default('littre');
        $table->string('destinataire');
        $table->string('produit');
        $table->time('heure');
        $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bon_de_livraisons');
    }
};


