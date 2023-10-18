using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly PgDbContext _context;

        public ExpenseController(PgDbContext context)
        {
            _context = context;
        }

        // POST: api/expense
        [HttpPost("expense")]
        public async Task<ActionResult<pw_expenses>> PostExpense(ExpenseRequest expense)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            expense.user_id = userId;
            _context.pw_expenses.Add(new pw_expenses
            {
                user_id = userId,
                expenses = expense.expenses,
                amount = expense.amount,
                frequency = expense.frequency,
                category = expense.category,
                start_date = expense.start_date.ToUniversalTime(),
            });
            await _context.SaveChangesAsync();

            var budgetData = DateDataGenerator.GroupByDate(new List<ItemExpense> { new ItemExpense {
                expenses = expense.expenses,
                expense_id = expense.id,
                amount = expense.amount,
                start_date = expense.start_date.ToUniversalTime(),
                frequency = expense.frequency,
                category = expense.category } });

            foreach (var date in budgetData.Keys)
            {
                foreach (var exp in budgetData[date])
                {
                    var budgetExpense = new pw_budget_table_expense
                    {
                        date = date.ToUniversalTime(),
                        user_id = userId,
                        expense_id = expense.id,
                        expenses = exp.expenses,
                        amount = exp.amount,
                        start_date = exp.start_date.ToUniversalTime(),
                        category = exp.category,
                        frequency = exp.frequency
                    };
                    _context.pw_budget_table_expense.Add(budgetExpense);
                }
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpense", new { id = expense.id }, new { success = true, message = "Expense created successfully", expense });
        }

        // GET: api/expense
        [HttpGet("expenses")]
        public async Task<ActionResult<IEnumerable<pw_expenses>>> GetExpenses()
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var expenses = await _context.pw_expenses.Where(e => e.user_id == userId).ToListAsync();

            if (expenses.Count == 0)
            {
                return NotFound(new { success = false, message = "Expense not found or not owned by the user" });
            }

            return Ok(new { success = true, message = "Expense retrieved successfully", expense = expenses });
        }

        // GET: api/expense/{id}
        [HttpGet("expenses/{id}")]
        public async Task<ActionResult<pw_expenses>> GetExpense(int id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var expense = await _context.pw_expenses.FindAsync(id);

            if (expense == null || expense.user_id != userId)
            {
                return NotFound(new { success = false, message = "Expense not found or not owned by the user" });
            }

            return Ok(new { success = true, message = "Expense retrieved successfully", expense });
        }

        // PUT: api/expense/{id}
        [HttpPut("expenses/{id}")]
        public async Task<IActionResult> PutExpense(int id, ExpenseRequest expense)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var existingExpense = await _context.pw_expenses.FindAsync(id);

            if (existingExpense == null || existingExpense.user_id != userId)
            {
                return NotFound(new { success = false, message = "Expense not found or not owned by the user" });
            }

            existingExpense.expenses = expense.expenses ?? existingExpense.expenses;
            existingExpense.amount = expense?.amount ?? existingExpense.amount;
            existingExpense.start_date = expense?.start_date ?? existingExpense.start_date;
            existingExpense.frequency = expense?.frequency ?? existingExpense.frequency;
            existingExpense.category = expense?.category ?? existingExpense.category;

            await _context.SaveChangesAsync();

            var budgetExpenses = _context.pw_budget_table_expense.Where(e => e.date > DateTime.UtcNow.Date && e.expense_id == id && e.user_id == userId);

            _context.pw_budget_table_expense.RemoveRange(budgetExpenses);

            await _context.SaveChangesAsync();

            var budgetData = DateDataGenerator.GroupByDate(new List<ItemExpense> { new ItemExpense {
                expenses = expense.expenses,
                expense_id = expense.id,
                amount = expense.amount,
                start_date = expense.start_date.ToUniversalTime(),
                frequency = expense.frequency,
                category = expense.category } });

            foreach (var date in budgetData.Keys)
            {
                foreach (var exp in budgetData[date])
                {
                    var budgetExpense = new pw_budget_table_expense
                    {
                        date = date.ToUniversalTime(),
                        user_id = userId,
                        expense_id = id,
                        expenses = exp.expenses,
                        amount = exp.amount,
                        start_date = exp.start_date.ToUniversalTime(),
                        category = exp.category,
                        frequency = exp.frequency
                    };
                    _context.pw_budget_table_expense.Add(budgetExpense);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Expense updated successfully", expense });
        }

        // DELETE: api/expense/{id}
        [HttpDelete("expenses/{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var user = _context.pw_users.Find(userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var expense = await _context.pw_expenses.FindAsync(id);

            if (expense == null || expense.user_id != userId)
            {
                return NotFound(new { success = false, message = "Expense not found or not owned by the user" });
            }

            _context.pw_expenses.Remove(expense);

            await _context.SaveChangesAsync();

            var budgetExpenses = _context.pw_budget_table_expense.Where(e => e.date > DateTime.Now.Date && e.expense_id == id && e.user_id == userId);

            _context.pw_budget_table_expense.RemoveRange(budgetExpenses);

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Expense deleted successfully" });
        }
    }
}
