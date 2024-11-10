<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    // Table associated with the model
    protected $table = 'pw_income';

    // Primary key for the model
    protected $primaryKey = 'id';

    // Whether the model should be timestamped
    public $timestamps = false;

    // Fillable attributes
    protected $fillable = [
        'source',
        'amount',
        'start_date',
        'frequency',
        'user_id',
    ];

    // Data types
    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'frequency' => 'integer',
    ];

    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relationship with the BudgetTableIncome model
    public function budgetTableIncomes()
    {
        return $this->hasMany(BudgetTableIncome::class, 'income_id', 'id');
    }
}
