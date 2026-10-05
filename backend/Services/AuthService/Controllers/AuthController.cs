using AuthService.DTOs;
using AuthService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var register = await _authService.RegisterAsync(request);
                if (!register.Success)
                {
                    return BadRequest(register); 
                }
                return Ok(register);
            } catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var login = await _authService.LoginAsync(request);
                if (!login.Success)
                {
                    return BadRequest(login);
                }
                return Ok(login);
            } catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> Verify([FromBody] VerifyOtpRequest request)
        {
            try
            {
                var verify = await _authService.VerifyAsync(request);
                if (!verify.Success)
                {
                    return BadRequest(verify);
                }
                return Ok(verify);
            } catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message});
            }
        }
    }
}
