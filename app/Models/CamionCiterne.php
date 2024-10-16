<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CamionCiterne extends Model
{
    use HasFactory;

    protected $table = 'camion_citernes';

    protected $fillable = ['immat', 'nomChauffeur', 'nombreCompartiment', 'volumeCompartiment'];

    public function sgf()
    {
        return $this->belongsToMany(Sgf::class, 'sgf_camion_citernes', 'idCamionCiterne', 'idUser');
    }

    public function bonDeLivraisons()
    {
        return $this->hasMany(BonDeLivraison::class, 'idCamionCiterne');
    }
}
