<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\BudgetController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/login', [UserController::class, 'login']);
Route::middleware(['validate.token'])->get('user', [UserController::class, 'get_user']);
Route::middleware(['validate.token'])->put('user', [UserController::class, 'update_user']);
// Protected routes using JWT validation
Route::middleware(['validate.token'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'createCategory']);
    Route::get('/categories', [CategoryController::class, 'getCategoriesByUser']);
    Route::get('/categories/{category_id}', [CategoryController::class, 'getCategory']);
    Route::put('/categories/{category_id}', [CategoryController::class, 'updateCategory']);
    Route::delete('/categories/{category_id}', [CategoryController::class, 'deleteCategory']);
    Route::post('/expense', [ExpenseController::class, 'createExpense']);
    Route::get('/expenses', [ExpenseController::class, 'getExpensesByUser']);
    Route::get('/expenses/{expense_id}', [ExpenseController::class, 'getExpense']);
    Route::put('/expenses/{expense_id}', [ExpenseController::class, 'updateExpense']);
    Route::delete('/expenses/{expense_id}', [ExpenseController::class, 'deleteExpense']);
    Route::post('/income', [IncomeController::class, 'createIncome']);
    Route::get('/income/user/{user_id}', [IncomeController::class, 'getIncomeByUser']);
    Route::get('/income/{user_id}/{income_id}', [IncomeController::class, 'getIncome']);
    Route::put('/income/{user_id}/{income_id}', [IncomeController::class, 'updateIncome']);
    Route::delete('/income/{user_id}/{income_id}', [IncomeController::class, 'deleteIncome']);
    Route::post('/notes', [BudgetController::class, 'createNote']);
    Route::get('/notes/{noteId}', [BudgetController::class, 'getNote']);
    Route::get('/notes', [BudgetController::class, 'getNotesByDate']);
    Route::put('/notes/{noteId}', [BudgetController::class, 'updateNote']);
    Route::put('/notes', [BudgetController::class, 'updateNotesByDate']);
    Route::delete('/notes/{noteId}', [BudgetController::class, 'deleteNote']);
    Route::put('/update_budgets', [BudgetController::class, 'updateBudgets']);
    Route::get('/get_budgets_in_date_range', [BudgetController::class, 'getBudgetsInDateRange']);
    Route::post('/notes', [BudgetController::class, 'create_note']);
    Route::get('/notes/{note_id}', [BudgetController::class, 'get_note']);
    Route::get('/notes', [BudgetController::class, 'get_notes_by_date']);
    Route::put('/notes/{note_id}', [BudgetController::class, 'update_note']);
    Route::put('/notes', [BudgetController::class, 'update_notes_by_date']);
    Route::delete('/notes/{note_id}', [BudgetController::class, 'delete_note']);

    // Budgets Routes
    Route::put('/update_budgets', [BudgetController::class, 'update_budgets']);
    Route::get('/get_budgets_in_date_range', [BudgetController::class, 'get_budgets_in_date_range']);
});
