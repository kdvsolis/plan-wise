using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginRequest
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class RegisterRequest
    {
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
    }

    public class UserRequest
    {
        public string email { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public decimal? balance { get; set; }
    }
    public class CategoryRequest
    {
        public string category_name { get; set; }
    }
    public class ExpenseRequest
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public string expenses { get; set; }

        public decimal amount { get; set; }

        public DateTime start_date { get; set; }

        public int frequency { get; set; }

        public int category { get; set; }
    }
    public class IncomeRequest
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public string source { get; set; }

        public decimal amount { get; set; }

        public DateTime start_date { get; set; }

        public int frequency { get; set; }
    }

}
