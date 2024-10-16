<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Boulangerie extends Model
{
    use HasFactory;

    protected $table = 'boulangeries';

    protected $fillable = ['idClient', 'responsable'];

    public function client()
    {
        return $this->belongsTo(Client::class, 'idClient');
    }
}
