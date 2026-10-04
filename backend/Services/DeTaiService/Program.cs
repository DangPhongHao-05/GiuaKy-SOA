using DeTaiService.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình ứng dụng chạy đồng thời cả 2 cổng 5003 (HTTP) và 7003 (HTTPS)
builder.WebHost.UseUrls("http://localhost:5003", "https://localhost:7003");

// 1. Đăng ký DbContext với chuỗi kết nối Supabase PostgreSQL
builder.Services.AddDbContext<DeTaiDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Đăng ký dịch vụ Controllers
builder.Services.AddControllers();

// Cấu hình CORS cho phép React frontend kết nối
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// ĐÃ TẮT SWAGGER theo yêu cầu (comment lại)
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();

// 3. Tự động chuyển hướng trang chủ (http://localhost:5003/) sang API lấy danh sách đề tài
//app.MapGet("/", () => Results.Redirect("/api/DeTai"));

// 4. Định tuyến đến các Controller (CRUD)
app.MapControllers();

app.Run();