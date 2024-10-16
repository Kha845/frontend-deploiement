<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stokeur;

class StokeurDepotController extends Controller
{
    public function index()
    {
        $stokeurs = Stokeur::with('depots')->get();

        return response()->json($stokeurs);
    }

    public function show($id)
    {
        $stokeur = Stokeur::with('depots')->find($id);

        if (!$stokeur) {
            return response()->json(['message' => 'Stokeur non trouvé'], 404);
        }

        return response()->json($stokeur);
    }
}
