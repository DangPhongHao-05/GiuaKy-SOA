using DeTaiService.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Thêm Controllers
builder.Services.AddControllers();

// 2. Đăng ký DbContext với Supabase PostgreSQL
builder.Services.AddDbContext<DeTaiDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// 3. Đăng ký Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Bật Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DeTaiService API v1");
        c.RoutePrefix = "";
    });
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();