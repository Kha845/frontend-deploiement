<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Fournisseur;
use App\Models\Depot;
use App\Models\Stokeur;
use App\Models\Client;
use App\Models\StationService;
use App\Models\Boulangerie;
use App\Models\GarageAutomobile;
use App\Models\BonDeCommande;
use App\Models\Facture;
use App\Models\ModePaiement;
use App\Models\BonDeLivraison;
use App\Models\CamionCiterne;
use App\Models\SGFFournisseurs;
use App\Models\SGFStockeurs;
use App\Models\SGFCamionCiternes;
use App\Models\SGFClients;
use App\Models\Role;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //factory fournisseur pour creer 5lignes 
        // Fournisseur::factory(5)->create();
        // Stokeur::factory(4)->create();
        // Depot::factory(4)->create();
        Role::factory()->count(5)->create();
        User::factory(5)->create();
        // Client::factory(5)->create();
        // StationService::factory(5)->create();
        // Boulangerie::factory(5)->create();
        // GarageAutomobile::factory(5)->create();
        // BonDeCommande::factory(5)->create([
        //     'UniteDeMesure' => 'littre'
        // ]);
        // ModePaiement::factory(5)->create();
        // Facture::factory(10)->create([
        //     'UniteDeMesure'=> 'Littre'
        // ]);
        // BonDeLivraison::factory(10)->create([
        //     'UniteDeMesure'=> 'Littre'
        // ]);
        // CamionCiterne::factory(10)->create();
        // SGFFournisseurs::factory(5)->create();
        // //SGFStockeurs::factory(5)->create();
        // SGFCamionCiternes::factory(5)->create();
        // SGFClients::factory(5)->create();
        

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
