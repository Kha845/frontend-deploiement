<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BonDeCommande;

class BonDeCommandeController extends Controller
{
   
    
    public function RecupFactImpaye()
    {
        $factimpayes = BonDeCommande::whereHas('factures', function($query) {
            $query->where('etat', 'impayée');  
        })->get();
        
        return response()->json($factimpayes);
    }
}


