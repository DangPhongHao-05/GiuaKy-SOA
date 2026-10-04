using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GiangVienService.DTOs
{
    public class CreateGiangVienDto
    {
        [MaxLength(50)]
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [MaxLength(50)]
        [JsonPropertyName("maGV")]
        public string? MaGV { get; set; }

        [Required(ErrorMessage = "Họ tên giảng viên không được để trống")]
        [MaxLength(200)]
        [JsonPropertyName("hoTen")]
        public string HoTen { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        [MaxLength(200)]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [MaxLength(100)]
        [JsonPropertyName("boMon")]
        public string? BoMon { get; set; }

        [MaxLength(100)]
        [JsonPropertyName("hocVi")]
        public string? HocVi { get; set; }
    }

    public class UpdateGiangVienDto
    {
        [MaxLength(200)]
        [JsonPropertyName("hoTen")]
        public string? HoTen { get; set; }

        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        [MaxLength(200)]
        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [MaxLength(100)]
        [JsonPropertyName("boMon")]
        public string? BoMon { get; set; }

        [MaxLength(100)]
        [JsonPropertyName("hocVi")]
        public string? HocVi { get; set; }
    }
}
