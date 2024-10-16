<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonDeLivraison extends Model
{
    use HasFactory;

    protected $table = 'bon_de_livraisons';

    protected $fillable = ['idCamionCiterne', 'dateLivraison', 'quantite', 'UniteDeMesure', 'destinataire', 'produit', 'heure'];

    public function camionCiterne()
    {
        return $this->belongsTo(CamionCiterne::class, 'idCamionCiterne');
    }
}
