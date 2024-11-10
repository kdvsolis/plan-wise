<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Services\IncomeService;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    protected $incomeService;

    public function __construct(IncomeService $incomeService)
    {
        $this->incomeService = $incomeService;
    }

    // Create a new income
    public function createIncome(Request $request)
    {
        $validated = $request->validate([
            'source' => 'required|string|max:1024',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'frequency' => 'nullable|integer',
            'user_id' => 'required|exists:pw_users,id',
        ]);

        $result = $this->incomeService->createIncome($validated);

        return response()->json($result, $result['success'] ? 201 : 400);
    }

    // Get income by user
    public function getIncomeByUser($user_id)
    {
        $result = $this->incomeService->getIncomeByUser($user_id);

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    // Get specific income
    public function getIncome($user_id, $income_id)
    {
        $result = $this->incomeService->getIncome($user_id, $income_id);

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    // Update income
    public function updateIncome(Request $request, $user_id, $income_id)
    {
        $validated = $request->validate([
            'source' => 'nullable|string|max:1024',
            'amount' => 'nullable|numeric',
            'start_date' => 'nullable|date',
            'frequency' => 'nullable|integer',
        ]);

        $result = $this->incomeService->updateIncome($user_id, $income_id, $validated);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    // Delete income
    public function deleteIncome($user_id, $income_id)
    {
        $result = $this->incomeService->deleteIncome($user_id, $income_id);

        return response()->json($result, $result['success'] ? 200 : 404);
    }
}
