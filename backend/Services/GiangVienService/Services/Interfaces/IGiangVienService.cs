using GiangVienService.DTOs;
using GiangVienService.Models;

namespace GiangVienService.Services.Interfaces
{
    public interface IGiangVienService
    {
        Task<IEnumerable<GiangVien>> GetAllAsync();
        Task<GiangVien?> GetByIdAsync(long id);
        Task<GiangVien> CreateAsync(CreateGiangVienDto dto);
        Task<GiangVien?> UpdateAsync(long id, UpdateGiangVienDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsAsync(long id);
    }
}
