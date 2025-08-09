<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $table = 'pw_notes'; // Specify the table name

    protected $fillable = [
        'date', // Date of the note
        'notes', // The content of the note
        'user_id', // Foreign key for the user
    ];

    // Define the relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
