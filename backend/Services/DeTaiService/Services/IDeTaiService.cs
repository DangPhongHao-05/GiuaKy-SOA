using DeTaiService.Models;

namespace DeTaiService.Services
{
    public interface IDeTaiService
    {
        Task<IEnumerable<DeTai>> GetAllAsync();
        Task<DeTai?> GetByIdAsync(long id);
        Task<DeTai> CreateAsync(DeTai deTai);
        Task<bool> UpdateAsync(long id, DeTai deTai);
        Task<bool> DeleteAsync(long id);
    }
}