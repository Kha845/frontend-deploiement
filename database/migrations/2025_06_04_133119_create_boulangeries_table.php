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
        Schema::create('boulangeries', function (Blueprint $table) {
            $table->id(); // Clé primaire auto-incrémentée 'id'
            $table->foreignId('idClient')->constrained('clients', 'idClient')->onDelete('cascade'); // Référence à idClient
            $table->string('responsable');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('boulangeries');
    }
};
