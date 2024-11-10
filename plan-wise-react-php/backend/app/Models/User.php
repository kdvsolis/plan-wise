<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    // Specify the table name
    protected $table = 'pw_users';

    // Specify the primary key
    protected $primaryKey = 'id';

    // Disable automatic timestamps
    public $timestamps = false;

    // Define fillable fields
    protected $fillable = [
        'email',
        'password',
        'name',
        'balance',
    ];

    // Hide the password field
    protected $hidden = [
        'password',
    ];

    // Cast the balance field as a decimal
    protected $casts = [
        'balance' => 'decimal:2',
    ];
}
