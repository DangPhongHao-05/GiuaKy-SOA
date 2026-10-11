using Microsoft.EntityFrameworkCore;
using SinhVienService.Data;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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

var jwtConfig = builder.Configuration.GetSection("Authentication:Jwt");
var secretKey = Encoding.UTF8.GetBytes(jwtConfig["Secret"] ?? "ChuoiBiMatSieuCapVipProDoAnTotNghiep123!@#");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig["Issuer"] ?? "Auth",
        ValidAudience = jwtConfig["Audience"] ?? "AuthClient",
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();


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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
