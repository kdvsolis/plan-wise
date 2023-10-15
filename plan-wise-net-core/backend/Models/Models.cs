using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class pw_users
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(256)]
        public string email { get; set; }

        [Required]
        [MaxLength(256)]
        public string password { get; set; }

        [MaxLength(2048)]
        public string name { get; set; }

        public decimal balance { get; set; }

        // Navigation property
        public ICollection<pw_categories> pw_categories { get; set; }
    }

    public class pw_categories
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(1024)]
        public string category_name { get; set; }

        [ForeignKey("pw_users")]
        public int user_id { get; set; }

        // Navigation property
        public pw_users user { get; set; }
    }


    public class pw_income
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(1024)]
        public string source { get; set; }

        public decimal amount { get; set; }

        public DateTime start_date { get; set; }

        public int frequency { get; set; }

        [ForeignKey("pw_users")]
        public int user_id { get; set; }

        // Navigation property
        public pw_users user { get; set; }
    }

    public class pw_expenses
    {
        [Key]
        public int id { get; set; }

        [Required]
        [MaxLength(1024)]
        public string expenses { get; set; }

        public decimal amount { get; set; }

        public DateTime start_date { get; set; }

        public int frequency { get; set; }

        [ForeignKey("pw_categories")]
        public int category { get; set; }

        [ForeignKey("pw_users")]
        public int user_id { get; set; }

        // Navigation properties
        public pw_categories pw_category { get; set; }
        public pw_users user { get; set; }
    }

    public class pw_notes
    {
        [Key]
        public int id { get; set; }

        [Required]
        public DateTime date { get; set; }

        [MaxLength(1024)]
        public string notes { get; set; }

        [ForeignKey("pw_users")]
        public int user_id { get; set; }

        // Navigation property
        public pw_users user { get; set; }
    }

    public class pw_budget_table_income
    {
        [Key]
        public int id { get; set; }

        public DateTime date { get; set; }

        [ForeignKey("pw_users")]
        public int user_id { get; set; }

        public int income_id { get; set; }

        [Required]
        [MaxLength(1024)]
        public string source { get; set; }

        public decimal amount { get; set; }

        public DateTime start_date { get; set; }

        public int frequency { get; set; }

        // Navigation property
        public pw_users user { get; set; }
    }

    public class pw_budget_table_expense
    {
        [Key]
        public int id { get; set; }

        public DateTime date { get; set; }

        [ForeignKey("pw_users")]
        public int user_id { get; set; }

        public int expense_id { get; set; }

        [Required]
        [MaxLength(1024)]
        public string expenses { get; set; }

        public decimal amount { get; set; }
        public int category { get; set; }

        public DateTime start_date { get; set; }

        public int frequency { get; set; }

        // Navigation property
        public pw_users user { get; set; }
    }
}
