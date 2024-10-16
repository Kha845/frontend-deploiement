<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonDeCommande extends Model
{
    use HasFactory;

    protected $table = 'bon_de_commandes';

    protected $fillable = ['emetteur', 'date', 'quantite', 'UniteDeMesure', 'format', 'produit', 'heure'];

    public function sgf()
    {
        return $this->belongsTo(UserSgf::class, 'idUser');
    }
    public function factures()
    {
        return $this->hasMany(Facture::class, 'idBonCommande');
    }
}
