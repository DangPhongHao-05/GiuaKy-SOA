using GiangVienService.Data;
using GiangVienService.Services.Implements;
using GiangVienService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

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

// 5. OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// 6. Tự động kiểm tra và khởi tạo bảng / nạp seed data trên Supabase nếu chưa có
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GiangVienDbContext>();
    try
    {
        db.Database.EnsureCreated();
        Console.WriteLine("[Supabase]: Kiểm tra và khởi tạo bảng giang_vien thành công.");
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
app.MapControllers();

app.Run();
