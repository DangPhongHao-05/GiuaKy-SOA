var builder = WebApplication.CreateBuilder(args);

// 1. Mở CORS cho Frontend (Sửa lại localhost:3000 hoặc localhost:5173 tùy theo React/Vite của bạn)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 2. Nạp cấu hình YARP từ section "ReverseProxy" trong appsettings.json
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// 3. Kích hoạt CORS (BẮT BUỘC phải đặt trước MapReverseProxy)
app.UseCors("AllowFrontend");

// 4. Bật Middleware điều phối của YARP
app.MapReverseProxy();

app.Run();