<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    // The name of the table
    protected $table = 'pw_categories';

    // Disable timestamps if they are not used in your schema
    public $timestamps = false;

    // Define the primary key (if it's not the default 'id')
    protected $primaryKey = 'id';

    // Specify which fields are mass assignable
    protected $fillable = [
        'category_name', 
        'user_id'
    ];

    // Specify the data types for each column in the table
    protected $casts = [
        'user_id' => 'integer',
    ];

    /**
     * Define the relationship between Category and User
     * (foreign key user_id)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Define the relationship between Category and Expense
     * (foreign key category)
     */
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'category');
    }
}
