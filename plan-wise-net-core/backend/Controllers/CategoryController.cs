using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly PgDbContext _context;

        public CategoriesController(PgDbContext context)
        {
            _context = context;
        }

        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest categoryRequest)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var existingCategory = await _context.pw_categories.FirstOrDefaultAsync(c => c.category_name == categoryRequest.category_name && c.user_id == userId);
            if (existingCategory != null)
            {
                return BadRequest(new { success = false, message = "Creation failed: Category already exists" });
            }

            var newCategory = new pw_categories
            {
                category_name = categoryRequest.category_name,
                user_id = userId
            };
            _context.pw_categories.Add(newCategory);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Category created successfully", category = newCategory });
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var categories = await _context.pw_categories.Where(c => c.user_id == userId).ToListAsync();

            if (categories.Count == 0)
            {
                return NotFound(new { success = false, message = "Categories not found" }) ;
            }

            return Ok(new { success = true, message = "Category retrieved successfully", category = categories });
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategoriesByUser()
        {
            // Kunin ang user_id mula sa JWT token
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var user = await _context.pw_users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var category_expenses = await _context.pw_categories
                .Where(c => c.user_id == userId)
                .Select(c => new
                {
                    id = c.id,
                    category_name = c.category_name,
                    average_monthly_expense = _context.pw_budget_table_expense
                        .Where(e => e.category == c.id && e.user_id == userId)
                        .Average(e => (decimal?)e.amount) / 12 ?? 0
                })
                .ToListAsync();

            if (category_expenses.Count == 0)
            {
                return NotFound(new { success = false, message = "No categories found for the user" });
            }

            return Ok(new { success = true, message = "Category retrieved successfully", category = category_expenses });
        }


        [HttpGet("categories/{category_id}")]
        public async Task<IActionResult> GetCategory(int category_id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var category = await _context.pw_categories.FirstOrDefaultAsync(c => c.id == category_id && c.user_id == userId);

            if (category == null)
            {
                return NotFound(new { success = false, message = "Category not found" });
            }

            return Ok(category);
        }

        [HttpPut("categories/{category_id}")]
        public async Task<IActionResult> UpdateCategory(int category_id, [FromBody] CategoryRequest categoryRequest)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var category = await _context.pw_categories.FirstOrDefaultAsync(c => c.id == category_id && c.user_id == userId);

            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            category.category_name = categoryRequest.category_name;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Category updated successfully", category = category });
        }

        [HttpDelete("categories/{category_id}")]
        public async Task<IActionResult> DeleteCategory(int category_id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var category = await _context.pw_categories.FirstOrDefaultAsync(c => c.id == category_id && c.user_id == userId);

            if (category == null)
            {
                return NotFound(new { success = false, message = "Category not found" });
            }

            _context.pw_categories.Remove(category);

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Category deleted successfully" });
        }
    }
}
