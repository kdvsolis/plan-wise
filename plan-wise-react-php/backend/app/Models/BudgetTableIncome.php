<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetTableIncome extends Model
{
    use HasFactory;

    // Table associated with the model
    protected $table = 'pw_budget_table_income';

    // Primary key for the model
    protected $primaryKey = 'id';

    // Whether the model should be timestamped
    public $timestamps = false;

    // Fillable attributes
    protected $fillable = [
        'date',
        'user_id',
        'income_id',
        'source',
        'amount',
        'start_date',
        'frequency',
    ];

    // Data types
    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'frequency' => 'integer',
        'date' => 'date',
    ];

    // Relationship with the Income model
    public function income()
    {
        return $this->belongsTo(Income::class, 'income_id', 'id');
    }

    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
