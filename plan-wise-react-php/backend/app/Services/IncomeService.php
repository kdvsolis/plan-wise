<?php

namespace App\Services;

use App\Models\Income;
use App\Models\BudgetTableIncome;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IncomeService
{
    // Create income and associated budget records
    public function createIncome($data)
    {
        try {
            $user = User::findOrFail($data['user_id']);
            $income = Income::create([
                'source' => $data['source'],
                'amount' => $data['amount'],
                'start_date' => $data['start_date'],
                'frequency' => $data['frequency'],
                'user_id' => $data['user_id'],
            ]);

            $budgetData = $this->generateBudgetData($income);

            foreach ($budgetData as $date => $budgetItem) {
                BudgetTableIncome::create([
                    'date' => $date,
                    'user_id' => $income->user_id,
                    'income_id' => $income->id,
                    'source' => $budgetItem['source'],
                    'amount' => $budgetItem['amount'],
                    'start_date' => $budgetItem['start_date'],
                    'frequency' => $budgetItem['frequency'],
                ]);
            }

            return [
                'success' => true,
                'message' => 'Income and budget created successfully',
                'income' => $income,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    // Get all income for a specific user
    public function getIncomeByUser($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        $incomes = Income::where('user_id', $user_id)->orderBy('start_date', 'ASC')->get();

        return [
            'success' => true,
            'message' => 'Incomes retrieved successfully',
            'income' => $incomes,
        ];
    }

    // Get a specific income for a user
    public function getIncome($user_id, $income_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        $income = Income::where('user_id', $user_id)->where('id', $income_id)->first();

        if (!$income) {
            return [
                'success' => false,
                'message' => 'Income not found or not owned by the user',
            ];
        }

        return [
            'success' => true,
            'message' => 'Income retrieved successfully',
            'income' => $income,
        ];
    }

    // Update income
    public function updateIncome($user_id, $income_id, $data)
    {
        $user = User::find($user_id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        $income = Income::where('user_id', $user_id)->where('id', $income_id)->first();

        if (!$income) {
            return [
                'success' => false,
                'message' => 'Income not found or not owned by the user',
            ];
        }

        $income->update($data);

        // Re-generate budget table entries if necessary
        BudgetTableIncome::where('income_id', $income_id)->delete();
        $budgetData = $this->generateBudgetData($income);

        foreach ($budgetData as $date => $budgetItem) {
            BudgetTableIncome::create([
                'date' => $date,
                'user_id' => $income->user_id,
                'income_id' => $income->id,
                'source' => $budgetItem['source'],
                'amount' => $budgetItem['amount'],
                'start_date' => $budgetItem['start_date'],
                'frequency' => $budgetItem['frequency'],
            ]);
        }

        return [
            'success' => true,
            'message' => 'Income updated successfully',
            'income' => $income,
        ];
    }

    // Delete income and related budget entries
    public function deleteIncome($user_id, $income_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        $income = Income::where('user_id', $user_id)->where('id', $income_id)->first();

        if (!$income) {
            return [
                'success' => false,
                'message' => 'Income not found or not owned by the user',
            ];
        }

        $income->delete();
        BudgetTableIncome::where('income_id', $income_id)->delete();

        return [
            'success' => true,
            'message' => 'Income deleted successfully',
        ];
    }

    // Helper function to generate budget data from an income record
    private function generateBudgetData(Income $income)
    {
        // Placeholder function to generate budget data based on frequency or date logic
        // You can add more logic here depending on how you need the budget data generated

        $budgetData = [];

        $startDate = Carbon::parse($income->start_date);
        $frequency = $income->frequency ?? 1;

        for ($i = 0; $i < $frequency; $i++) {
            $date = $startDate->addMonths($i)->toDateString();

            $budgetData[$date] = [
                'source' => $income->source,
                'amount' => $income->amount,
                'start_date' => $income->start_date,
                'frequency' => $income->frequency,
            ];
        }

        return $budgetData;
    }
}
