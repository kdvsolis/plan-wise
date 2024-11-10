<?php

namespace App\Services;

use App\Models\BudgetTableIncome;
use App\Models\BudgetTableExpense;
use App\Models\Note;
use Carbon\Carbon;

class BudgetService
{
    public function __construct()
    {
        // Optional: if you need initialization
    }

    public function getBudgetsInDateRange($user_id, $start_date_str = null)
    {
        $earliest_date = BudgetTableIncome::min('date');
        $start_date = $start_date_str ? Carbon::parse($start_date_str) : Carbon::parse($earliest_date);
        $end_date = $start_date->copy()->endOfMonth();

        // Retrieve incomes and expenses
        $incomes_in_range = BudgetTableIncome::whereBetween('date', [$start_date, $end_date])
            ->where('user_id', $user_id)
            ->orderBy('date', 'asc')
            ->get();

        $expenses_in_range = BudgetTableExpense::whereBetween('date', [$start_date, $end_date])
            ->where('user_id', $user_id)
            ->orderBy('date', 'asc')
            ->get();

        $formatted_data = [];
        
        foreach ($incomes_in_range as $income) {
            $formatted_data[$income->date]['income'][] = $income;
        }

        foreach ($expenses_in_range as $expense) {
            $formatted_data[$expense->date]['expense'][] = $expense;
        }

        return [
            'success' => true,
            'message' => 'Retrieved budgets in date range',
            'budgets' => $formatted_data
        ];
    }

    public function updateIncome($income_data)
    {
        $record = BudgetTableIncome::find($income_data['id']);
        if (!$record) {
            return null;
        }

        $record->update($income_data);
        return $record;
    }

    public function updateExpense($expense_data)
    {
        $record = BudgetTableExpense::find($expense_data['id']);
        if (!$record) {
            return null;
        }

        $record->update($expense_data);
        return $record;
    }

    public function createNote($user_id, $date, $notes)
    {
        $note = Note::create([
            'user_id' => $user_id,
            'date' => Carbon::parse($date),
            'notes' => $notes,
        ]);

        return [
            'success' => true,
            'message' => 'Note created successfully',
            'note' => $note
        ];
    }

    public function getNoteById($user_id, $note_id)
    {
        $note = Note::where('user_id', $user_id)->find($note_id);
        if (!$note) {
            return [
                'success' => false,
                'message' => 'Note not found or not owned by the user'
            ];
        }

        return [
            'success' => true,
            'message' => 'Note retrieved successfully',
            'note' => $note
        ];
    }

    public function getNotesByDate($user_id, $date)
    {
        $notes = Note::where('user_id', $user_id)->whereDate('date', $date)->get();
        if ($notes->isEmpty()) {
            return [
                'success' => false,
                'message' => 'No notes found for the user on this date'
            ];
        }

        return [
            'success' => true,
            'message' => 'Notes retrieved successfully',
            'notes' => $notes
        ];
    }

    public function updateNoteById($user_id, $note_id, $new_notes)
    {
        $note = Note::where('user_id', $user_id)->find($note_id);
        if (!$note) {
            return [
                'success' => false,
                'message' => 'Note not found or not owned by the user'
            ];
        }

        $note->notes = $new_notes;
        $note->save();

        return [
            'success' => true,
            'message' => 'Note updated successfully',
            'note' => $note
        ];
    }

    public function deleteNoteById($user_id, $note_id)
    {
        $note = Note::where('user_id', $user_id)->find($note_id);
        if (!$note) {
            return [
                'success' => false,
                'message' => 'Note not found or not owned by the user'
            ];
        }

        $note->delete();

        return [
            'success' => true,
            'message' => 'Note deleted successfully'
        ];
    }
}
