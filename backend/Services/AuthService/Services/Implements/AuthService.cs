using AuthService.DTOs;
using AuthService.Models.Generated;
using AuthService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Services.Implements
{
    public class AuthServiceApp : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public AuthServiceApp (AppDbContext context, IEmailService emailService, IConfiguration config)
        {
            _context = context;
            _emailService = emailService;
            _config = config;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExists)
            {
                return new AuthResponse { Success = false, Message = "Email này đã được đăng ký." };
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newAccount = new User
            {
                Email = request.Email,
                FullName = request.FullName,
                PasswordHash = passwordHash,
                IsEmailVerified = false
            };

            _context.Users.Add(newAccount);
            await _context.SaveChangesAsync();

            return new AuthResponse { Success = true, Message = "Đăng ký thành công!" };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponse { Success = false, Message = "Tài khoản hoặc mật khẩu không đúng" };
            }

            string otp = new Random().Next(100000, 999999).ToString();
            user.OtpCode = otp;
            user.OtpExpiredAt = DateTime.UtcNow.AddMinutes(5);

            await _context.SaveChangesAsync();
            await _emailService.SendOtpEmailAsync(user.Email, otp);

            return new AuthResponse { Success = true, Message = "Vui lòng kiểm tra email để lấy mã xác thực OTP." };
        }

        public async Task<TokenResponse> VerifyAsync(VerifyOtpRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.OtpCode != request.OtpCode)
                return new TokenResponse { Success = false, Message = "Mã OTP không hợp lệ." };

            if (user.OtpExpiredAt < DateTime.UtcNow)
                return new TokenResponse { Success = false, Message = "Mã OTP đã hết hạn." };

            user.OtpCode = null;
            user.OtpExpiredAt = null;

            var oldTokens = await _context.RefreshTokens.Where(rt => rt.UserId == user.Id).ToListAsync();
            _context.RefreshTokens.RemoveRange(oldTokens);

            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            var newRefreshToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken),
                ExpiresAt = DateTime.UtcNow.AddDays(double.Parse(_config["Authentication:Jwt:RefreshTokenExpirationDays"] ?? "7"))
            };

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            return new TokenResponse
            {
                Success = true,
                Message = "Xác thực thành công.",
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        private string GenerateJwtToken(User user)
        {
            var secretKey = _config["Authentication:Jwt:Secret"];
            if (string.IsNullOrEmpty(secretKey)) throw new Exception("Thiếu cấu hình JWT Secret.");

            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey));
            var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(securityKey, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Email),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, user.Role ?? "User")
            };

            var expireMinutes = double.Parse(_config["Authentication:Jwt:AccessTokenExpirationMinutes"] ?? "30");

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: _config["Authentication:Jwt:Issuer"],
                audience: _config["Authentication:Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: credentials);

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
