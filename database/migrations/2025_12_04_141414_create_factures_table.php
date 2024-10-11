<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->string('reference');
            $table->string('emetteur');
            $table->string('depot');
            $table->string('format');
            $table->string('designation');
            $table->decimal('prixUnitaire', 10, 2);
            $table->integer('quantite');
            $table->decimal('montant', 10, 2);
            $table->string('UniteDeMesure');
            $table->date('date');
            $table->string('etat');
            $table->foreignId('idModePaiement')->constrained('mode_paiements')->onDelete('cascade');
            $table->foreignId('idBonLivraison')->nullable()->constrained('bon_de_livraisons')->onDelete('set null');  // clé étrangère
            $table->foreignId('idBonCommande')->nullable()->constrained('bon_de_commandes')->onDelete('set null');
            $table->decimal('taxe', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('factures');
    }
};


