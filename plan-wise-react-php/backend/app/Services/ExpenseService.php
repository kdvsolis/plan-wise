<?php
namespace App\Services;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ExpenseService
{
    public function createExpense($user_id, $expenses)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $expense = Expense::create([
            'user_id' => $user_id,
            'expenses' => $expenses['expenses'],
            'amount' => $expenses['amount'],
            'start_date' => $expenses['start_date'],
            'frequency' => $expenses['frequency'],
            'category' => $expenses['category'],
        ]);

        return ['success' => true, 'message' => 'Expense created successfully', 'expense' => $expense];
    }

    public function getExpensesByUser($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $expenses = Expense::where('user_id', $user_id)->orderBy('start_date')->get();
        if ($expenses->isEmpty()) {
            return ['success' => false, 'message' => 'No expenses found'];
        }

        return ['success' => true, 'message' => 'Expenses retrieved successfully', 'expense' => $expenses];
    }

    public function getExpense($user_id, $expense_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $expense = Expense::where('user_id', $user_id)->find($expense_id);
        if (!$expense) {
            return ['success' => false, 'message' => 'Expense not found or not owned by the user'];
        }

        return ['success' => true, 'message' => 'Expense retrieved successfully', 'expense' => $expense];
    }

    public function updateExpense($user_id, $expense_id, $data)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $expense = Expense::where('user_id', $user_id)->find($expense_id);
        if (!$expense) {
            return ['success' => false, 'message' => 'Expense not found or not owned by the user'];
        }

        $expense->update($data);
        return ['success' => true, 'message' => 'Expense updated successfully', 'expense' => $expense];
    }

    public function deleteExpense($user_id, $expense_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $expense = Expense::where('user_id', $user_id)->find($expense_id);
        if (!$expense) {
            return ['success' => false, 'message' => 'Expense not found or not owned by the user'];
        }

        $expense->delete();
        return ['success' => true, 'message' => 'Expense deleted successfully'];
    }
}
