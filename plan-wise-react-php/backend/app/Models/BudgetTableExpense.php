<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetTableExpense extends Model
{
    use HasFactory;

    // Table associated with the model
    protected $table = 'pw_budget_table_expense';

    // Primary key for the model
    protected $primaryKey = 'id';

    // Whether the model should be timestamped
    public $timestamps = false;

    // Fillable attributes
    protected $fillable = [
        'date',
        'user_id',
        'expense_id',
        'expenses',
        'amount',
        'start_date',
        'frequency',
        'category',
    ];

    // Data types
    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'frequency' => 'integer',
        'date' => 'date',
    ];

    // Relationship with the Expense model
    public function expense()
    {
        return $this->belongsTo(Expense::class, 'expense_id', 'id');
    }

    // Relationship with the Category model
    public function category()
    {
        return $this->belongsTo(Category::class, 'category', 'id');
    }

    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
