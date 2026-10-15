using GiangVienService.Data;
using GiangVienService.Services.Implements;
using GiangVienService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình chạy cả 2 cổng HTTP 5004 và HTTPS 7004
builder.WebHost.UseUrls("http://localhost:5004", "https://localhost:7004");

// 1. Cấu hình chuỗi kết nối Supabase PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration.GetConnectionString("Supabase");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Không tìm thấy chuỗi kết nối cơ sở dữ liệu Supabase trong cấu hình.");
}

builder.Services.AddDbContext<GiangVienDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Đăng ký Dependency Injection cho Service
builder.Services.AddScoped<IGiangVienService, GiangVienServiceImpl>();

// 3. Đăng ký Controllers
builder.Services.AddControllers();

// 4. Cấu hình CORS cho phép React frontend kết nối
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var jwtSettings = builder.Configuration.GetSection("Authentication:Jwt");
var secretKey = jwtSettings["Secret"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set true nếu chạy production có HTTPS
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// 5. OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// 6. Tự động kiểm tra và khởi tạo bảng / nạp seed data trên Supabase nếu chưa có
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GiangVienDbContext>();
    try
    {
        const string createTableSql = @"
            CREATE TABLE IF NOT EXISTS public.giang_vien (
                ma_gv VARCHAR(50) PRIMARY KEY,
                ho_ten VARCHAR(200) NOT NULL,
                email VARCHAR(200) NOT NULL,
                bo_mon VARCHAR(100),
                hoc_vi VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );";
        db.Database.ExecuteSqlRaw(createTableSql);

        if (!db.GiangViens.Any())
        {
            db.GiangViens.AddRange(
                new GiangVienService.Models.GiangVien
                {
                    MaGV = "GV001",
                    HoTen = "TS. Nguyễn Văn Toàn",
                    Email = "toannv@qnu.edu.vn",
                    BoMon = "Hệ thống thông tin",
                    HocVi = "Tiến sĩ",
                    CreatedAt = DateTime.UtcNow
                },
                new GiangVienService.Models.GiangVien
                {
                    MaGV = "GV002",
                    HoTen = "ThS. Trần Thị Mai",
                    Email = "maitt@qnu.edu.vn",
                    BoMon = "Kỹ thuật phần mềm",
                    HocVi = "Thạc sĩ",
                    CreatedAt = DateTime.UtcNow
                },
                new GiangVienService.Models.GiangVien
                {
                    MaGV = "GV003",
                    HoTen = "PGS.TS. Lê Đình Minh",
                    Email = "minhld@qnu.edu.vn",
                    BoMon = "Khoa học máy tính",
                    HocVi = "Phó Giáo sư",
                    CreatedAt = DateTime.UtcNow
                },
                new GiangVienService.Models.GiangVien
                {
                    MaGV = "GV004",
                    HoTen = "ThS. Phạm Quốc Cường",
                    Email = "cuongpq@qnu.edu.vn",
                    BoMon = "Mạng máy tính & Viễn thông",
                    HocVi = "Thạc sĩ",
                    CreatedAt = DateTime.UtcNow
                }
            );
            db.SaveChanges();
            Console.WriteLine("[Supabase]: Đã khởi tạo bảng giang_vien và nạp seed data thành công.");
        }
        else
        {
            Console.WriteLine("[Supabase]: Bảng giang_vien đã tồn tại sẵn dữ liệu.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Cảnh báo khởi tạo CSDL]: {ex.Message}");
    }
}

// 7. Pipeline cấu hình
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
