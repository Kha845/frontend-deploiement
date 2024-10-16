<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SGFCamionCiternes extends Model
{
    use HasFactory;

    protected $table = 'user_sgf_camion_citernes';

    protected $fillable = ['idUser', 'idCamionCiterne'];
}
