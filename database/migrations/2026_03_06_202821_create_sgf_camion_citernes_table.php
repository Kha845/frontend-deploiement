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
        Schema::create('user_sgf_camion_citernes', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('idUser'); 
            $table->foreign('idUser')->references('idUser')->on('user_sgfs')->onDelete('cascade'); 
            $table->unsignedBigInteger('idCamionCiterne'); 
            $table->foreign('idCamionCiterne')->references('id')->on('camion_citernes')->onDelete('cascade'); 
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
        Schema::dropIfExists('user_sgf_camion_citernes');
    }
};
