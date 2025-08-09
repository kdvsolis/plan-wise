<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    // The name of the table
    protected $table = 'pw_expenses';

    // Disable timestamps if not used in your schema
    public $timestamps = false;

    // Define the primary key (if it's not the default 'id')
    protected $primaryKey = 'id';

    // Specify which attributes are mass assignable
    protected $fillable = [
        'expenses', 
        'amount', 
        'start_date', 
        'frequency', 
        'category', 
        'user_id'
    ];

    // Specify the data types for each column in the table
    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'frequency' => 'integer',
        'category' => 'integer',
        'user_id' => 'integer',
    ];

    /**
     * Define the relationship between Expense and Category (foreign key)
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category');
    }

    /**
     * Define the relationship between Expense and User (foreign key)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
