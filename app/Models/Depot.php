<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depot extends Model
{
    use HasFactory;
    protected $table = 'depots';
    protected $primaryKey = 'idDepot';

    protected $fillable = ['nom', 'adresse', 'idStokeur'];

    public function stokeur()
    {
        return $this->belongsTo(Stokeur::class, 'idStokeur');
    }
}
