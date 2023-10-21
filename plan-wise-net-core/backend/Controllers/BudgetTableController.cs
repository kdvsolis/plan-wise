using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetTableController : ControllerBase
    {
        private readonly PgDbContext _context;

        public BudgetTableController(PgDbContext context)
        {
            _context = context;
        }

        [HttpGet("get_budgets_in_date_range")]
        public IActionResult GetBudgetsInDateRange(DateTime? start_date_str)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var earliestDate = _context.pw_budget_table_income.Min(i => i.date);
            var startDate = DateTime.SpecifyKind((start_date_str ?? earliestDate), DateTimeKind.Utc);

            var endDate = DateTime.SpecifyKind(new DateTime(startDate.Year, startDate.Month, DateTime.DaysInMonth(startDate.Year, startDate.Month)), DateTimeKind.Utc);

            var incomesInRange = _context.pw_budget_table_income
                .Where(i => i.date >= startDate && i.date <= endDate && i.user_id == userId)
                .OrderBy(i => i.date)
                .ToList();

            var expensesInRange = _context.pw_budget_table_expense
                .Where(e => e.date >= startDate && e.date <= endDate && e.user_id == userId)
                .OrderBy(e => e.date)
                .ToList();

            var formattedData = new Dictionary<DateTime, dynamic>();

            foreach (var item in incomesInRange)
            {
                if (!formattedData.ContainsKey(item.date))
                {
                    formattedData[item.date] = new { user_id = userId, income = new List<dynamic>(), expense = new List<dynamic>(), notes = "" };
                }
                formattedData[item.date].income.Add(item);
            }

            foreach (var item in expensesInRange)
            {
                if (!formattedData.ContainsKey(item.date))
                {
                    formattedData[item.date] = new { user_id = userId, income = new List<dynamic>(), expense = new List<dynamic>(), notes = "" };
                }
                formattedData[item.date].expense.Add(item);
            }

            return Ok(new { success = true, message = "Retrieved budgets in date range", budgets = formattedData });
        }

        [HttpPut("update_budgets")]
        public IActionResult UpdateBudgets([FromBody] BudgetRequest budget)
        {
            try
            {
                var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                // Update income
                foreach (var income in budget.income)
                {
                    var record = _context.pw_budget_table_income.FirstOrDefault(i => i.id == income.id && i.user_id == userId);
                    if (record == null)
                    {
                        return BadRequest(new { success = false, message = "Invalid Request" });
                    }

                    // Update the properties of the record
                    record.date = income.date;
                    record.source = income.source;
                    record.amount = income.amount;
                    record.start_date = income.start_date;

                    _context.SaveChanges();
                }

                // Update expenses
                foreach (var expense in budget.expense)
                {
                    var record = _context.pw_budget_table_expense.FirstOrDefault(e => e.id == expense.id);
                    if (record == null)
                    {
                        return BadRequest(new { success = false, message = "Invalid Request" });
                    }

                    // Update the properties of the record
                    record.date = expense.date;
                    record.user_id = expense.user_id;
                    record.expenses = expense.expenses;
                    record.amount = expense.amount;
                    record.start_date = expense.start_date;

                    _context.SaveChanges();
                }

                return Ok(new { success = true, message = "Budgets updated successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(new { success = false, message = e.Message });
            }
        }

    }
}
