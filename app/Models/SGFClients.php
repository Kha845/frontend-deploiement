<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SGFClients extends Model
{
    use HasFactory;
    protected $table = 'user_sgf_clients';

    protected $fillable = ['idUser', 'idClient'];
}
