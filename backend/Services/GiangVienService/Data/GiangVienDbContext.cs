using GiangVienService.Models;
using Microsoft.EntityFrameworkCore;

namespace GiangVienService.Data
{
    public class GiangVienDbContext : DbContext
    {
        public GiangVienDbContext(DbContextOptions<GiangVienDbContext> options) : base(options) { }

        public DbSet<GiangVien> GiangViens { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<GiangVien>(entity =>
            {
                entity.ToTable("giang_vien");
                entity.HasKey(e => e.MaGV);

                entity.Property(e => e.MaGV).HasColumnName("ma_gv").HasMaxLength(50);
                entity.Property(e => e.HoTen).HasColumnName("ho_ten").HasMaxLength(200).IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(200).IsRequired();
                entity.Property(e => e.BoMon).HasColumnName("bo_mon").HasMaxLength(100);
                entity.Property(e => e.HocVi).HasColumnName("hoc_vi").HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Seed dữ liệu ban đầu từ Frontend Mock Data
                entity.HasData(
                    new GiangVien
                    {
                        MaGV = "GV001",
                        HoTen = "TS. Nguyễn Văn Toàn",
                        Email = "toannv@qnu.edu.vn",
                        BoMon = "Hệ thống thông tin",
                        HocVi = "Tiến sĩ",
                        CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new GiangVien
                    {
                        MaGV = "GV002",
                        HoTen = "ThS. Trần Thị Mai",
                        Email = "maitt@qnu.edu.vn",
                        BoMon = "Kỹ thuật phần mềm",
                        HocVi = "Thạc sĩ",
                        CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new GiangVien
                    {
                        MaGV = "GV003",
                        HoTen = "PGS.TS. Lê Đình Minh",
                        Email = "minhld@qnu.edu.vn",
                        BoMon = "Khoa học máy tính",
                        HocVi = "Phó Giáo sư",
                        CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    },
                    new GiangVien
                    {
                        MaGV = "GV004",
                        HoTen = "ThS. Phạm Quốc Cường",
                        Email = "cuongpq@qnu.edu.vn",
                        BoMon = "Mạng máy tính & Viễn thông",
                        HocVi = "Thạc sĩ",
                        CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                    }
                );
            });
        }
    }
}
