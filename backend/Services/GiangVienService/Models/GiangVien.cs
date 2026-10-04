using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GiangVienService.Models
{
    [Table("giang_vien")]
    public class GiangVien
    {
        [Key]
        [Column("ma_gv")]
        [JsonPropertyName("maGV")]
        [Required(ErrorMessage = "Mã giảng viên không được để trống")]
        [MaxLength(50)]
        public string MaGV { get; set; } = string.Empty;

        // Định danh Id kiểu string ánh xạ song song với MaGV
        [NotMapped]
        [JsonPropertyName("id")]
        public string Id
        {
            get => MaGV;
            set => MaGV = value;
        }

        [Column("ho_ten")]
        [JsonPropertyName("hoTen")]
        [Required(ErrorMessage = "Họ tên giảng viên không được để trống")]
        [MaxLength(200)]
        public string HoTen { get; set; } = string.Empty;

        [Column("email")]
        [JsonPropertyName("email")]
        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Column("bo_mon")]
        [JsonPropertyName("boMon")]
        [MaxLength(100)]
        public string? BoMon { get; set; }

        [Column("hoc_vi")]
        [JsonPropertyName("hocVi")]
        [MaxLength(100)]
        public string? HocVi { get; set; }

        [Column("created_at")]
        [JsonPropertyName("createdAt")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
