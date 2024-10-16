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
        Schema::create('users', function (Blueprint $table) {
            $table->id('idUser'); // Utilisation de 'idSGF' comme clé primaire
            $table->string('prenom');
            $table->string('nom');
            $table->string('adresseSGF');
            $table->string('telephone');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('matricule');
            $table->boolean('etat')->nullable()->default(false);
            $table->unsignedBigInteger('role_id')->nullable(); 
            $table->foreign('role_id') // Clé étrangère vers la table 'roles'
                ->references('id')
                ->on('roles')
                ->onDelete('set null');
            $table->string('poste');
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
        Schema::dropIfExists('users');
    }
};
