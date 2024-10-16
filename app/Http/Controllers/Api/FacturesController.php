<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Facture;

class FacturesController extends Controller
{
    public function TotalFactPaye(){
        $total = Facture::where('etat', 'payée')->sum('montant');

        return response()->json([
            'total_montant_factures_payees' => $total
        ]);
    }

    public function NombreFactImpaye(){
        $total = Facture::where('etat', 'payée')->count();

        return response()->json([
            'nombre_facture_payee' => $total
        ]);
    }

    
}
