<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stokeurs', function (Blueprint $table) {
            $table->id('idStokeur');
            $table->string('nom');
            $table->string('adresse');
            $table->string('telephone');
            $table->timestamps();
        });
    }
 
    public function down()
    {
        Schema::dropIfExists('stokeurs');
    }
};
