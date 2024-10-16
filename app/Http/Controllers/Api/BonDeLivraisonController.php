<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BonDeLivraison;

class BonDeLivraisonController extends Controller
{
    //Recuperer les bons de livraisons avec les details des camions associes
    public function index(){

        $bondelivraison = BonDeLivraison::with('camionCiterne')->get();

        return response()->json($bondelivraison);

    } 

    public function show(){
         // Filtrer les bons de livraisons par le camion-citerne avec immatriculation '368'
        $bondelivraison = BonDeLivraison::whereHas('camionCiterne', function ($query) {
            $query->where('immat', '368');  // Filtrer les camions citernes avec immat '368'
        })->with('camionCiterne')->get();

        return response()->json($bondelivraison);
    }
}
