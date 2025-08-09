<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'pw_users';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['email', 'password', 'name', 'balance'];
    protected $hidden = ['password'];
    protected $casts = ['balance' => 'decimal:2'];
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

}