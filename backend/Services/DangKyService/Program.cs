using DangKyService.Models;
using DangKyService.Services.Impl;
using DangKyService.Services.Impl.External;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PostgresContext>(options =>
	options.UseNpgsql(
		builder.Configuration.GetConnectionString("DefaultConnection")
	)
);

builder.Services.AddScoped<DangKyServiceImpl>();
builder.Services.AddScoped<SinhVienServiceImpl>();
builder.Services.AddScoped<DeTaiServiceImpl>();
builder.Services.AddScoped<GiangVienServiceImpl>();

builder.Services.AddHttpClient<SinhVienServiceImpl>(client => {
	client.BaseAddress = new Uri("https://localhost:7005");
});
builder.Services.AddHttpClient<DeTaiServiceImpl>(client => {
	client.BaseAddress = new Uri("https://localhost:7003");
});
builder.Services.AddHttpClient<GiangVienServiceImpl>(client => {
	client.BaseAddress = new Uri("https://localhost:7004");
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
//builder.Services.AddCors(options => {
//	options.AddPolicy("cors", policy => {
//		policy
//		//.AllowAnyOrigin()
//		.WithOrigins("http://localhost:5262")
//		.AllowAnyHeader()
//		.AllowAnyMethod()
//		.AllowCredentials();
//	});
//});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
//app.UseCors("cors");
app.MapControllers();

app.Run();