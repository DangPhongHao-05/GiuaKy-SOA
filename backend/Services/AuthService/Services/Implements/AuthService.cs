using AuthService.DTOs;
using AuthService.Models.Generated;
using AuthService.Services.Implements.External;
using AuthService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Services.Implements
{
    public class AuthServiceApp : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        private readonly SinhVienExternalService _sinhVienExternalService;

        public AuthServiceApp (AppDbContext context, IEmailService emailService, IConfiguration config, SinhVienExternalService sinhVienExternalService)
        {
            _context = context;
            _emailService = emailService;
            _config = config;
            _sinhVienExternalService = sinhVienExternalService;
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
                IsEmailVerified = false,
                Role = "SinhVien"
            };

            // 1. KHỞI TẠO TRANSACTION ĐỂ ĐẢM BẢO TÍNH TOÀN VẸN DỮ LIỆU
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.Users.Add(newAccount);
                await _context.SaveChangesAsync(); // Lưu tạm thời tài khoản vào DB

                // Mapping dữ liệu chuẩn bị gửi sang SinhVienService
                var sinhVienRequest = new SinhVienCreateRequest
                {
                    MaSv = request.MaSv,
                    HoTen = request.FullName,
                    Email = request.Email
                };

                // 2. GỌI SANG EXTERNAL SERVICE
                bool isSinhVienCreated = await _sinhVienExternalService.CreateSinhVienAsync(sinhVienRequest);

                // 3. KIỂM TRA KẾT QUẢ VÀ QUYẾT ĐỊNH ROLLBACK HAY COMMIT
                if (!isSinhVienCreated)
                {
                    // Lỗi: Hủy bỏ việc tạo tài khoản vừa rồi!
                    await transaction.RollbackAsync();
                    return new AuthResponse
                    {
                        Success = false, // Chuyển thành false để Frontend báo lỗi màu đỏ
                        Message = "Đăng ký thất bại: Không thể tạo hồ sơ Sinh viên (Mã SV có thể đã tồn tại hoặc dịch vụ đang lỗi)."
                    };
                }

                // Thành công: Xác nhận lưu vĩnh viễn vào DB
                await transaction.CommitAsync();
                return new AuthResponse { Success = true, Message = "Đăng ký thành công!" };
            }
            catch (Exception)
            {
                // Có lỗi không mong muốn (vd: sập mạng khi đang call SinhVienService) -> Hủy tạo tài khoản
                await transaction.RollbackAsync();
                return new AuthResponse
                {
                    Success = false,
                    Message = "Lỗi hệ thống trong quá trình đăng ký. Yêu cầu đã bị hủy."
                };
            }
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

        public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest request)
        {
            // 1. Kiểm tra User có tồn tại không
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return new TokenResponse { Success = false, Message = "Người dùng không tồn tại." };
            }

            // 2. Lấy tất cả Refresh Tokens CÒN HẠN của User này
            var activeTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == request.UserId && rt.ExpiresAt >= DateTime.UtcNow)
                .ToListAsync();

            if (!activeTokens.Any())
            {
                return new TokenResponse { Success = false, Message = "Không có token nào hợp lệ. Vui lòng đăng nhập lại." };
            }

            // 3. Dùng BCrypt để verify xem token gửi lên khớp với mã hash nào trong DB
            RefreshToken? validTokenEntity = null;
            foreach (var rt in activeTokens)
            {
                if (BCrypt.Net.BCrypt.Verify(request.RefreshToken, rt.TokenHash))
                {
                    validTokenEntity = rt;
                    break;
                }
            }

            if (validTokenEntity == null)
            {
                return new TokenResponse { Success = false, Message = "Refresh Token không chính xác hoặc đã bị thu hồi." };
            }

            // 4. Thu hồi Token cũ (Refresh Token Rotation)
            _context.RefreshTokens.Remove(validTokenEntity);

            // 5. Sinh cặp Token mới
            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            var newRefreshTokenEntity = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = BCrypt.Net.BCrypt.HashPassword(newRefreshToken),
                ExpiresAt = DateTime.UtcNow.AddDays(double.Parse(_config["Authentication:Jwt:RefreshTokenExpirationDays"] ?? "7"))
            };

            _context.RefreshTokens.Add(newRefreshTokenEntity);
            await _context.SaveChangesAsync();

            return new TokenResponse
            {
                Success = true,
                Message = "Làm mới Token thành công.",
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
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
