using GiangVienService.DTOs;
using GiangVienService.Models;

namespace GiangVienService.Services.Interfaces
{
    public interface IGiangVienService
    {
        Task<IEnumerable<GiangVien>> GetAllAsync();
        Task<GiangVien?> GetByIdAsync(string id);
        Task<GiangVien> CreateAsync(CreateGiangVienDto dto);
        Task<GiangVien?> UpdateAsync(string id, UpdateGiangVienDto dto);
        Task<bool> DeleteAsync(string id);
        Task<bool> ExistsAsync(string id);
    }
}
