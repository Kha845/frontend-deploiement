<?php

namespace App\Models;


use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'users';
    protected $primaryKey = 'idUser';

    protected $fillable = ['prenom', 'nom','adresseSGF', 'telephone', 'email', 'password', 'matricule', 'poste'];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function fournisseurs()
    {
        return $this->belongsToMany(Fournisseur::class, 'user_sgf_fournisseurs', 'idUser', 'idFournisseur');
    }

    public function stockeurs()
    {
        return $this->belongsToMany(Stokeur::class, 'user_sgf_stockeurs', 'idUser', 'idStokeur');
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'user_sgf_clients', 'idUser', 'idClient');
    }

    public function camionCiterne()
    {
        return $this->belongsToMany(CamionCiterne::class, 'user_sgf_camion_citernes', 'idUser', 'idCamionCiterne');
    }
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}
