<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BudgetService;

class BudgetController extends Controller
{
    protected $budgetService;

    public function __construct(BudgetService $budgetService)
    {
        $this->budgetService = $budgetService;
    }

    // Method to create a note
    public function create_note(Request $request)
    {
        $user_id = auth()->id(); // Assuming the token is validated, we get the current authenticated user
        $date = $request->input('date');
        $notes = $request->input('notes');

        $result = $this->budgetService->createNote($user_id, $date, $notes);
        return response()->json($result);
    }

    // Method to get a note by its ID
    public function get_note($note_id)
    {
        $user_id = auth()->id();
        $result = $this->budgetService->getNoteById($user_id, $note_id);
        return response()->json($result);
    }

    // Method to get notes by date
    public function get_notes_by_date(Request $request)
    {
        $user_id = auth()->id();
        $date = $request->input('date');
        $result = $this->budgetService->getNotesByDate($user_id, $date);
        return response()->json($result);
    }

    // Method to update a note
    public function update_note(Request $request, $note_id)
    {
        $user_id = auth()->id();
        $new_notes = $request->input('notes');
        $result = $this->budgetService->updateNoteById($user_id, $note_id, $new_notes);
        return response()->json($result);
    }

    // Method to update notes by date
    public function update_notes_by_date(Request $request)
    {
        $user_id = auth()->id();
        $new_notes = $request->input('notes');
        $result = $this->budgetService->updateNotesByDate($user_id, $request->input('date'), $new_notes);
        return response()->json($result);
    }

    // Method to delete a note by its ID
    public function delete_note($note_id)
    {
        $user_id = auth()->id();
        $result = $this->budgetService->deleteNoteById($user_id, $note_id);
        return response()->json($result);
    }

    // Method to update budgets
    public function update_budgets(Request $request)
    {
        $income_data = $request->input('income');
        $expense_data = $request->input('expense');

        $result = [
            'income' => $this->budgetService->updateIncome($income_data),
            'expense' => $this->budgetService->updateExpense($expense_data)
        ];

        return response()->json($result);
    }

    // Method to get budgets within a date range
    public function get_budgets_in_date_range(Request $request)
    {
        $user_id = auth()->id();
        $start_date = $request->input('start_date');
        $result = $this->budgetService->getBudgetsInDateRange($user_id, $start_date);
        return response()->json($result);
    }
}
