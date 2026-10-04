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

var app = builder.Build();

// ĐÃ TẮT SWAGGER theo yêu cầu (comment lại)
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseHttpsRedirection();
app.UseAuthorization();

// 3. Tự động chuyển hướng trang chủ (http://localhost:5003/) sang API lấy danh sách đề tài
//app.MapGet("/", () => Results.Redirect("/api/DeTai"));

// 4. Định tuyến đến các Controller (CRUD)
app.MapControllers();

app.Run();