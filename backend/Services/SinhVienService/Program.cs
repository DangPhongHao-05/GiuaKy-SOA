using Microsoft.EntityFrameworkCore;
using SinhVienService.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
var supabaseConnectionString = builder.Configuration.GetConnectionString("Supabase");
if (string.IsNullOrWhiteSpace(supabaseConnectionString))
{
    throw new InvalidOperationException(
        "Missing Supabase database connection string. Configure ConnectionStrings__Supabase.");
}

builder.Services.AddDbContext<SinhVienDbContext>(options =>
    options.UseNpgsql(supabaseConnectionString));
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
