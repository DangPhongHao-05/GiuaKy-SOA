using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeTaiService.Models // Kiểm tra xem đúng namespace của bạn chưa
{
    [Table("de_tai")]
    public class DeTai
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("ten_de_tai")]
        public string TenDeTai { get; set; } = string.Empty;

        [Column("mo_ta")]
        public string? MoTa { get; set; }
    }
}