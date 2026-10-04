using GiangVienService.Data;
using GiangVienService.DTOs;
using GiangVienService.Models;
using GiangVienService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GiangVienService.Services.Implements
{
    public class GiangVienServiceImpl : IGiangVienService
    {
        private readonly GiangVienDbContext _context;

        public GiangVienServiceImpl(GiangVienDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GiangVien>> GetAllAsync()
        {
            return await _context.GiangViens
                .AsNoTracking()
                .OrderBy(g => g.MaGV)
                .ToListAsync();
        }

        public async Task<GiangVien?> GetByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return null;
            }

            return await _context.GiangViens
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.MaGV == id.Trim());
        }

        public async Task<GiangVien> CreateAsync(CreateGiangVienDto dto)
        {
            var gvId = (!string.IsNullOrWhiteSpace(dto.Id) ? dto.Id : dto.MaGV ?? string.Empty).Trim();

            var entity = new GiangVien
            {
                MaGV = gvId,
                HoTen = dto.HoTen.Trim(),
                Email = dto.Email.Trim(),
                BoMon = dto.BoMon?.Trim(),
                HocVi = dto.HocVi?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.GiangViens.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<GiangVien?> UpdateAsync(string id, UpdateGiangVienDto dto)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return null;
            }

            var existing = await _context.GiangViens.FirstOrDefaultAsync(g => g.MaGV == id.Trim());
            if (existing == null)
            {
                return null;
            }

            if (!string.IsNullOrWhiteSpace(dto.HoTen))
            {
                existing.HoTen = dto.HoTen.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                existing.Email = dto.Email.Trim();
            }

            if (dto.BoMon != null)
            {
                existing.BoMon = dto.BoMon.Trim();
            }

            if (dto.HocVi != null)
            {
                existing.HocVi = dto.HocVi.Trim();
            }

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return false;
            }

            var existing = await _context.GiangViens.FirstOrDefaultAsync(g => g.MaGV == id.Trim());
            if (existing == null)
            {
                return false;
            }

            _context.GiangViens.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return false;
            }

            return await _context.GiangViens.AnyAsync(g => g.MaGV == id.Trim());
        }
    }
}
