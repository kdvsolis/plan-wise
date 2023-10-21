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
    public class IncomeController : ControllerBase
    {
        private readonly PgDbContext _context;

        public IncomeController(PgDbContext context)
        {
            _context = context;
        }

        // POST: api/income
        [HttpPost("income")]
        public async Task<ActionResult<pw_income>> PostIncome(IncomeRequest income)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            income.user_id = userId;
            income.start_date = DateTime.SpecifyKind(income.start_date, DateTimeKind.Utc);
            _context.pw_income.Add(new pw_income
            {
                user_id = userId,
                source = income.source,
                amount = income.amount,
                frequency = income.frequency,
                start_date = income.start_date,
            });
            await _context.SaveChangesAsync();

            var budgetData = DateDataGenerator.GroupByDate(new List<ItemIncome> { new ItemIncome {
                source = income.source,
                income_id = income.id,
                amount = income.amount,
                start_date = DateTime.SpecifyKind(income.start_date, DateTimeKind.Utc),
                frequency = income.frequency} 
            }.Cast<IItem>().ToList());

            foreach (var date in budgetData.Keys)
            {
                foreach (var exp in budgetData[date])
                {
                    var budgetIncome = new pw_budget_table_income
                    {
                        date = DateTime.SpecifyKind(date, DateTimeKind.Utc),
                        source = income.source,
                        user_id = userId,
                        amount = exp.amount,
                        income_id = income.id,
                        start_date = DateTime.SpecifyKind(exp.start_date, DateTimeKind.Utc),
                        frequency = exp.frequency
                    };

                    _context.pw_budget_table_income.Add(budgetIncome);
                }
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIncome", new { id = income.id }, new { success = true, message = "Income created successfully", income });
        }


        // GET: api/income
        [HttpGet("income")]
        public async Task<ActionResult<IEnumerable<pw_income>>> GetIncome()
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var income = await _context.pw_income.Where(e => e.user_id == userId).ToListAsync();

            if (income.Count == 0)
            {
                return NotFound(new { success = false, message = "Income not found or not owned by the user" });
            }

            return Ok(new { success = true, message = "Income retrieved successfully", income = income });
        }

        // GET: api/income/{id}
        [HttpGet("income/{id}")]
        public async Task<ActionResult<pw_income>> GetIncome(int id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var income = await _context.pw_income.FindAsync(id);

            if (income == null || income.user_id != userId)
            {
                return NotFound(new { success = false, message = "Income not found or not owned by the user" });
            }

            return Ok(new { success = true, message = "Income retrieved successfully", income });
        }

        // PUT: api/income/{id}
        [HttpPut("income/{id}")]
        public async Task<IActionResult> PutIncome(int id, IncomeRequest income)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var existingIncome = await _context.pw_income.FindAsync(id);

            if (existingIncome == null || existingIncome.user_id != userId)
            {
                return NotFound(new { success = false, message = "Income not found or not owned by the user" });
            }

            existingIncome.source = income.source ?? existingIncome.source;
            existingIncome.amount = income?.amount ?? existingIncome.amount;
            if (income?.start_date != null)
            {
                existingIncome.start_date = DateTime.SpecifyKind(income.start_date, DateTimeKind.Utc);
            }
            existingIncome.frequency = income?.frequency ?? existingIncome.frequency;

            await _context.SaveChangesAsync();

            var budgetIncomeRange = _context.pw_budget_table_income.Where(e => e.date > DateTime.UtcNow.Date && e.income_id == id && e.user_id == userId);

            _context.pw_budget_table_income.RemoveRange(budgetIncomeRange);

            await _context.SaveChangesAsync();

            var budgetData = DateDataGenerator.GroupByDate(new List<ItemIncome> { new ItemIncome {
                source = income.source,
                income_id = income.id,
                amount = income.amount,
                start_date = DateTime.SpecifyKind(income.start_date, DateTimeKind.Utc),
                frequency = income.frequency } 
            });

            foreach (var date in budgetData.Keys)
            {
                foreach (var exp in budgetData[date])
                {
                    var budgetIncome = new pw_budget_table_income
                    {
                        date = DateTime.SpecifyKind(date, DateTimeKind.Utc),
                        user_id = userId,
                        income_id = id,
                        source = exp.source,
                        amount = exp.amount,
                        start_date = DateTime.SpecifyKind(exp.start_date, DateTimeKind.Utc),
                        frequency = exp.frequency
                    };
                    _context.pw_budget_table_income.Add(budgetIncome);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Income updated successfully", income });
        }

        // DELETE: api/income/{id}
        [HttpDelete("income/{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var user = _context.pw_users.Find(userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var income = await _context.pw_income.FindAsync(id);

            if (income == null || income.user_id != userId)
            {
                return NotFound(new { success = false, message = "Income not found or not owned by the user" });
            }

            _context.pw_income.Remove(income);

            await _context.SaveChangesAsync();

            var budgetIncome = _context.pw_budget_table_income.Where(e => e.date > DateTime.Now.Date && e.income_id == id && e.user_id == userId);

            _context.pw_budget_table_income.RemoveRange(budgetIncome);

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Income deleted successfully" });
        }
    }
}
