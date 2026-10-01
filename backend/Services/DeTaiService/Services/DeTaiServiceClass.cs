using Microsoft.EntityFrameworkCore;
using DeTaiService.Data;
using DeTaiService.Models;

namespace DeTaiService.Services
{
    public class DeTaiServiceClass : IDeTaiService
    {
        private readonly DeTaiDbContext _context;

        public DeTaiServiceClass(DeTaiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DeTai>> GetAllAsync()
        {
            return await _context.DeTais.ToListAsync();
        }

        public async Task<DeTai?> GetByIdAsync(long id)
        {
            return await _context.DeTais.FindAsync(id);
        }

        public async Task<DeTai> CreateAsync(DeTai deTai)
        {
            _context.DeTais.Add(deTai);
            await _context.SaveChangesAsync();
            return deTai;
        }

        public async Task<bool> UpdateAsync(long id, DeTai deTai)
        {
            if (id != deTai.Id) return false;
            _context.Entry(deTai).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var deTai = await _context.DeTais.FindAsync(id);
            if (deTai == null) return false;
            _context.DeTais.Remove(deTai);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}