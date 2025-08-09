using Microsoft.AspNetCore.Mvc;
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
        [HttpPost("notes")]
        public IActionResult CreateNote([FromBody] NotesRequest noteRequest)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "User not found" });
            }

            var note = new pw_notes { user_id = userId, date = DateTime.SpecifyKind(noteRequest.date, DateTimeKind.Utc), notes = noteRequest.notes };
            _context.pw_notes.Add(note);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Note created successfully", note });
        }

        [HttpGet("notes")]
        public IActionResult GetNotesByDate(DateTime date)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var notes = _context.pw_notes.FirstOrDefault(n => n.user_id == userId && n.date == DateTime.SpecifyKind(date, DateTimeKind.Utc));
            if (notes == null)
            {
                return NotFound(new { success = false, message = "Notes not found or not owned by the user" });
            }

            return Ok(new { success = true, message = "Notes retrieved successfully", notes });
        }

        [HttpPut("notes/{noteId}")]
        public IActionResult UpdateNote(int noteId, [FromBody] NotesRequest noteRequest)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var note = _context.pw_notes.FirstOrDefault(n => n.id == noteId && n.user_id == userId);
            if (note == null)
            {
                return NotFound(new { success = false, message = "Note not found or not owned by the user" });
            }

            note.notes = noteRequest.notes;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Note updated successfully", note });
        }

        [HttpDelete("notes/{noteId}")]
        public IActionResult DeleteNote(int noteId)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _context.pw_users.Find(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var note = _context.pw_notes.FirstOrDefault(n => n.id == noteId && n.user_id == userId);
            if (note == null)
            {
                return NotFound(new { success = false, message = "Note not found or not owned by the user" });
            }

            _context.pw_notes.Remove(note);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Note deleted successfully" });
        }

        [HttpPut("notes")]
        public IActionResult UpdateNotesByDate(DateTime date, [FromBody] NotesRequest noteRequest)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var userNotesToUpdate = _context.pw_notes.Where(n => n.user_id == userId && n.date == DateTime.SpecifyKind(date, DateTimeKind.Utc)).ToList();
            if (userNotesToUpdate.Count() == 0)
            {
                return NotFound(new { success = false, message = "No notes found for this user on the given date" });
            }

            foreach (var note in userNotesToUpdate)
            {
                note.notes = noteRequest.notes;
            }

            _context.SaveChanges();

            return Ok(new { success = true, message = "Notes updated successfully" });
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
                    record.date = DateTime.SpecifyKind(income.date, DateTimeKind.Utc);
                    record.source = income.source;
                    record.amount = income.amount;
                    record.start_date = DateTime.SpecifyKind(income.start_date, DateTimeKind.Utc);

                    _context.SaveChanges();
                }

                // Update expenses
                foreach (var expense in budget.expense)
                {
                    var record = _context.pw_budget_table_expense.FirstOrDefault(e => e.id == expense.id && e.user_id == userId);
                    if (record == null)
                    {
                        return BadRequest(new { success = false, message = "Invalid Request" });
                    }

                    // Update the properties of the record
                    record.date = DateTime.SpecifyKind(expense.date, DateTimeKind.Utc);
                    record.expenses = expense.expenses;
                    record.amount = expense.amount;
                    record.start_date = DateTime.SpecifyKind(expense.start_date, DateTimeKind.Utc);

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
