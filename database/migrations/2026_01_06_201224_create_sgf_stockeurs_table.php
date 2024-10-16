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
        Schema::create('user_sgf_stockeurs', function (Blueprint $table) {
            $table->id(); // Crée une clé primaire 'id'
    
            // Colonne pour la clé étrangère vers 'user_sgfs'
            $table->unsignedBigInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('users')->onDelete('cascade');
            
            // Colonne pour la clé étrangère vers 'stokeurs'
            $table->unsignedBigInteger('idStokeur'); 
            $table->foreign('idStokeur')->references('idStokeur')->on('stokeurs')->onDelete('cascade');
        
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
        Schema::dropIfExists('user_sgf_stockeurs');
    }
};
