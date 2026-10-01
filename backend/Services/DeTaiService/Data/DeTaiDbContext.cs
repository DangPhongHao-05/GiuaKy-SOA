using Microsoft.EntityFrameworkCore;
using DeTaiService.Models;

namespace DeTaiService.Data
{
    public class DeTaiDbContext : DbContext
    {
        public DeTaiDbContext(DbContextOptions<DeTaiDbContext> options)
            : base(options)
        {
        }

        public DbSet<DeTai> DeTais { get; set; } = null!;
    }
}