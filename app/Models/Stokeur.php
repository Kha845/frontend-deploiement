<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stokeur extends Model
{
    use HasFactory;

    protected $table = 'stokeurs';
    protected $primaryKey = 'idStokeur';

    protected $fillable = ['nom', 'adresse', 'telephone'];

    public function sgf()
    {
        return $this->belongsToMany(Sgf::class, 'sgf_stockeurs', 'idStokeur', 'idSGF');
    }

    public function depots()
    {
        return $this->hasMany(Depot::class, 'idStokeur');
    }
}
