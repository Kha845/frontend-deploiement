<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stokeur;

class StockeurController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function index()
    // {
    //     $stockeur = Stokeur::all();
    //     return response()->json($stockeur);
    // }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function store(Request $request)
    // {
    //     $stockeur = Stokeur::create($request->all()); // Crée un nouveau fournisseur
    //     return response()->json($stockeur, 201);
    // }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function show($id)
    // {
    //     $stockeur = Stokeur::findOrFail($id); // Trouve un fournisseur par son ID
    //     return response()->json($stockeur);
    // }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function update(Request $request, $id)
    // {
    //     $stockeur = Stokeur::findOrFail($id);
    //     $stockeur = update($request->all());
    //     return response()->json($stockeur);
    // }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function destroy($id)
    // {
    //     Stokeur::destroy($id); // Supprime un fournisseur par son ID
    //     return response()->json(null, 204);
    // }
}
