<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;

class AuthController extends Controller
{
    // Méthode d'enregistrement
    public function register(Request $request)
    {
        // Validation des données d'entrée
        $validator = Validator::make($request->all(), [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'adresseSGF' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'matricule' => 'required|string|unique:users|max:255',
            'role_id' => 'nullable|exists:roles,id',
            'poste' => 'required|string|max:255',
        ]);

        // Si la validation échoue
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Création de l'utilisateur
        $user = User::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'adresseSGF' => $request->adresseSGF,
            'telephone' => $request->telephone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'matricule' => $request->matricule,
            'role_id' => $request->role_id,
            'poste' => $request->poste,
        ]);

        // Génération du token JWT pour l'utilisateur
        $token = auth()->login($user);

        return $this->respondWithToken($token);
    }

    // Méthode de connexion
    public function login(Request $request)
    {
        // Validation des données de connexion
        $credentials = $request->only('email', 'password');

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    // Méthode de déconnexion
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Méthode pour obtenir l'utilisateur connecté
    public function me()
    {
        return response()->json(auth()->user());
    }

    // Méthode pour rafraîchir le token
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    // Répondre avec un token
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
