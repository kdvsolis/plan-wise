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

}
