<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
   
    use HasFactory;

    protected $table = 'fournisseurs';
    protected $primaryKey = 'idFournisseur';

    protected $fillable = ['nom', 'adresse', 'telephone', 'email'];

    public function sgf()
    {
        return $this->belongsToMany(SGF::class, 'sgf_fournisseurs', 'idFournisseur', 'idSGF');
    }
}
