<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GarageAutomobile extends Model
{
    use HasFactory;

    protected $table = 'garage_automobiles';

    protected $fillable = ['idClient', 'nombreDeVoiture', 'nombreDeChauffeur', 'nomChauffeur', 'chefGarage', 'adresse_garage'];

    public function client()
    {
        return $this->belongsTo(Client::class, 'idClient');
    }
}
