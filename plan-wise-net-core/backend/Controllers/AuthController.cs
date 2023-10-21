using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly PgDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ILogger<AuthController> logger, PgDbContext context, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            var existingUser = await _context.pw_users.FirstOrDefaultAsync(u => u.email == registerRequest.username);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Registration failed: Username already exists" });
            }

            var newUser = new pw_users
            {
                email = registerRequest.username,
                password = BCrypt.Net.BCrypt.HashPassword(registerRequest.password),
                name = registerRequest.name
            };
            _context.pw_users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _context.pw_users.FirstOrDefaultAsync(u => u.email == loginRequest.username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.password, user.password))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { success = true, token = tokenString });
        }

        [HttpGet("user")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var userId = int.Parse(userIdClaim.Value);

            var user = await _context.pw_users.FindAsync(userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            return Ok(new { success = true, user = user });
        }

        [HttpPut("user")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateUser([FromBody] UserRequest userRequest)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var userId = int.Parse(userIdClaim.Value);

            var user = await _context.pw_users.FindAsync(userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            user.name = userRequest.name ?? user.name;
            user.email = userRequest.email ?? user.email;
            if (userRequest.password != null)
            {
                user.password = BCrypt.Net.BCrypt.HashPassword(userRequest.password);
            }
            user.balance = userRequest.balance ?? user.balance;

            await _context.SaveChangesAsync();

            return Ok(user);
        }
    }
}
