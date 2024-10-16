<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SGFFournisseurs extends Model
{
    use HasFactory;
    protected $table = 'user_sgf_fournisseurs'; 

    protected $fillable = ['idUser', 'idFournisseur'];
}
