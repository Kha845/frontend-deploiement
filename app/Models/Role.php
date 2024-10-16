<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillabe = ["nom_role"];

    public function users()
    {
        return $this->hasMany(UserSgf::class, 'role_id');
    }
}
