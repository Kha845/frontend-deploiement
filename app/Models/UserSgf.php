<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSgf extends Model
{
    use HasFactory;

    protected $table = 'user_sgfs';
    protected $primaryKey = 'idUser';

    protected $fillable = ['prenom', 'nom','adresseSGF', 'telephone', 'email', 'password', 'matricule', 'poste'];

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
}
