<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;

class AuthController extends Controller
{
    // Enregistrement d'un nouvel utilisateur
    public function register(Request $request)
    {
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

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'adresseSGF' => $request->adresseSGF,
            'telephone' => $request->telephone,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'matricule' => $request->matricule,
            'role_id' => $request->role_id,
            'poste' => $request->poste,
        ]);

        $token = Auth::login($user);

        return $this->respondWithToken($token);
    }

    // Connexion d'un utilisateur
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }
    public function getRole()
    {
    // Récupère l'utilisateur authentifié
        $user = Auth::user();

        // Récupère son rôle
        $role = $user->role;

        if ($role) {
            return response()->json([
                'role' => $role->nom_role, 
            ]);
        } else {
            return response()->json(['message' => 'No role assigned to this user'], 404);
        }
    }

    // Profil utilisateur (route protégée)
    public function profile()
    {
        return response()->json(Auth::user());
    }

    // Déconnexion (route protégée)
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Rafraîchir le token JWT (route protégée)
    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }

    // Répondre avec le token JWT
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60
        ]);
    }
}
