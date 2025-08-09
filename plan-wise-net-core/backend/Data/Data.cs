using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class PgDbContext : DbContext
    {
        public PgDbContext(DbContextOptions<PgDbContext> options) : base(options)
        {
        }

        public DbSet<pw_users> pw_users { get; set; }
        public DbSet<pw_categories> pw_categories { get; set; }
        public DbSet<pw_income> pw_income { get; set; }
        public DbSet<pw_expenses> pw_expenses { get; set; }
        public DbSet<pw_notes> pw_notes { get; set; }
        public DbSet<pw_budget_table_income> pw_budget_table_income { get; set; }
        public DbSet<pw_budget_table_expense> pw_budget_table_expense { get; set; }
    }
}
