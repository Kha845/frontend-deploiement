<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FournisseurController;
use App\Http\Controllers\Api\StockeurController;
use App\Http\Controllers\Api\BonDeCommandeController;
use App\Http\Controllers\Api\BonDeLivraisonController;
use App\Http\Controllers\Api\FacturesController;
use App\Http\Controllers\Api\StokeurDepotController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['prefix' => 'auth'], function () {
    // Routes non protégées
    Route::post('register', [AuthController::class, 'register']);  // Enregistrement
    Route::post('login', [AuthController::class, 'login']);        // Connexion
});
// Routes protégées par le middleware JWT
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('profile', [AuthController::class, 'profile']);    // Profil utilisateur
    Route::post('logout', [AuthController::class, 'logout']);     // Déconnexion
    Route::post('refresh', [AuthController::class, 'refresh']);   // Rafraîchir le token
    Route::get('user-role', [AuthController::class, 'getRole']);
});


//Route::apiResource('fournisseurs', FournisseurController::class);









// //Bon de commande dont les factures sont impayees, payes, en attente
// Route::get('/bon-de-commandes/impayes', [BonDeCommandeController::class, 'RecupFactImpaye']);
// //Bon de livraison avec les details des camions associe
// Route::get('/bon-livraisons', [BonDeLivraisonController::class, 'index']);
// //Bon de livraison avec les details d'un camion associe
// Route::get('/bon-livraisons/show', [BonDeLivraisonController::class, 'show']);
// //Montant total des factures payes
// Route::get('/factures-payees/total', [FacturesController::class, 'TotalFactPaye']);
// //Nombre de factures payer
// Route::get('/factures-payees/nombrefactpaye', [FacturesController::class, 'NombreFactImpaye']);
// //Récupérer les Stokeurs avec leurs dépôts associés
// Route::get('/stokeurs', [StokeurDepotController::class, 'index']);
// //Recuperer le depot d'un stokeur
// Route::get('/stokeurs/{id}', [StokeurDepotController::class, 'show']);
