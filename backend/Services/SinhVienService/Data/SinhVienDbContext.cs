using Microsoft.EntityFrameworkCore;
using SinhVienService.Models;

namespace SinhVienService.Data
{
    public class SinhVienDbContext : DbContext
    {
        public SinhVienDbContext(DbContextOptions<SinhVienDbContext> options)
            : base(options)
        {
        }

        public DbSet<SinhVien> SinhViens { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SinhVien>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<SinhVien>()
                .HasIndex(s => s.MaSv)
                .IsUnique();
        }
    }
}
