using Microsoft.EntityFrameworkCore;
using SinhVienService.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var supabaseConnectionString = builder.Configuration.GetConnectionString("SinhVienDb")
    ?? builder.Configuration.GetConnectionString("Supabase");

if (string.IsNullOrWhiteSpace(supabaseConnectionString))
{
    throw new InvalidOperationException(
        "Missing Supabase database connection string. Configure ConnectionStrings:SinhVienDb or ConnectionStrings:Supabase.");
}

builder.Services.AddDbContext<SinhVienDbContext>(options =>
    options.UseNpgsql(supabaseConnectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");
// app.UseHttpsRedirection();
app.MapControllers();

app.Run();
