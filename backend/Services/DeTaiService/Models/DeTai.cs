using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeTaiService.Models
{
    [Table("de_tai")]
    public class DeTai
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("ten_de_tai")]
        public string TenDeTai { get; set; } = string.Empty;

        [Column("mo_ta")]
        public string? MoTa { get; set; }

        [Column("linh_vuc")]
        public string? LinhVuc { get; set; }

        [Column("trang_thai")]
        public string? TrangThai { get; set; }
    }
}