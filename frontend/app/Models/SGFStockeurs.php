<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SGFStockeurs extends Model
{
    use HasFactory;
    protected $table = 'user_sgf_stockeurs';

    protected $fillable = ['idUser', 'idStockeurs'];
    
}
