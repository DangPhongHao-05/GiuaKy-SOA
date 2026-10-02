using DeTaiService.Models;
using Microsoft.EntityFrameworkCore;

namespace DeTaiService.Data
{
    public class DeTaiDbContext : DbContext
    {
        public DeTaiDbContext(DbContextOptions<DeTaiDbContext> options) : base(options) { }

        public DbSet<DeTai> DeTais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DeTai>().ToTable("de_tai");
        }
    }
}