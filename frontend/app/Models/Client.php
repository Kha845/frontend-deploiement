<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = 'clients';
    protected $primaryKey = 'idClient';

    protected $fillable = ['nom', 'adresse', 'telephone', 'email'];

    public function sgf()
    {
        return $this->belongsToMany(Sgf::class, 'sgf_clients', 'idClient', 'idSGF');
    }

    public function stationsServices()
    {
        return $this->hasMany(StationService::class, 'idClient');
    }

    public function boulangeries()
    {
        return $this->hasMany(Boulangerie::class, 'idClient');
    }

    public function garagesAutomobiles()
    {
        return $this->hasMany(GarageAutomobile::class, 'idClient');
    }
}
