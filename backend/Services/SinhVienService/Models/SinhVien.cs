using System.ComponentModel.DataAnnotations;

namespace SinhVienService.Models
{
    public class SinhVien
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string MaSv { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string HoTen { get; set; } = null!;

        public DateTime? NgaySinh { get; set; }

        [MaxLength(50)]
        public string? Lop { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? Phone { get; set; }
    }
}
