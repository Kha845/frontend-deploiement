<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;

    protected $table = 'factures';

    protected $fillable = ['reference','fournisseur','emetteur', 'prixUnitaire', 'quantite', 'montant', 'UniteDeMesure', 'date', 'etat', 'idModePaiement', 'idBonLivraison', 'idBonCommande', 'taxe'];

    public function modePaiement()
    {
        return $this->belongsTo(ModePaiement::class, 'idModePaiement');
    }

    public function bonLivraison()
    {
        return $this->belongsTo(BonDeLivraison::class, 'idBonLivraison');
    }

    public function bonCommande()
    {
        return $this->belongsTo(BonDeCommande::class, 'idBonCommande');
    }
}
