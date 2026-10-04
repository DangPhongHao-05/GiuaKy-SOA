using GiangVienService.DTOs;
using GiangVienService.Models;

namespace GiangVienService.Services.Interfaces
{
    public interface IGiangVienService
    {
        Task<IEnumerable<GiangVien>> GetAllAsync();
        Task<GiangVien?> GetByMaGvAsync(string maGv);
        Task<GiangVien> CreateAsync(CreateGiangVienDto dto);
        Task<GiangVien?> UpdateAsync(string maGv, UpdateGiangVienDto dto);
        Task<bool> DeleteAsync(string maGv);
        Task<bool> ExistsAsync(string maGv);
    }
}
