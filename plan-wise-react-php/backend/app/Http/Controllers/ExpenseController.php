<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\ExpenseService;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    protected $expenseService;

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }

    public function createExpense(Request $request)
    {
        $result = $this->expenseService->createExpense($request->user_id, $request->all());
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function getExpensesByUser(Request $request)
    {
        $result = $this->expenseService->getExpensesByUser($request->user_id);
        return response()->json($result, $result['success'] ? 200 : 404);
    }

    public function getExpense(Request $request, $expense_id)
    {
        $result = $this->expenseService->getExpense($request->user_id, $expense_id);
        return response()->json($result, $result['success'] ? 200 : 404);
    }

    public function updateExpense(Request $request, $expense_id)
    {
        $result = $this->expenseService->updateExpense($request->user_id, $expense_id, $request->all());
        return response()->json($result, $result['success'] ? 200 : ($result['message'] === 'Expense not found or not owned by the user' ? 404 : 400));
    }

    public function deleteExpense(Request $request, $expense_id)
    {
        $result = $this->expenseService->deleteExpense($request->user_id, $expense_id);
        return response()->json($result, $result['success'] ? 200 : 404);
    }
}
