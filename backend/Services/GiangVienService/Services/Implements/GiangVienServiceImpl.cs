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

        public async Task<GiangVien?> GetByMaGvAsync(string maGv)
        {
            return await _context.GiangViens
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.MaGV == maGv);
        }

        public async Task<GiangVien> CreateAsync(CreateGiangVienDto dto)
        {
            var entity = new GiangVien
            {
                MaGV = dto.MaGV.Trim(),
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

        public async Task<GiangVien?> UpdateAsync(string maGv, UpdateGiangVienDto dto)
        {
            var existing = await _context.GiangViens.FirstOrDefaultAsync(g => g.MaGV == maGv);
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

        public async Task<bool> DeleteAsync(string maGv)
        {
            var existing = await _context.GiangViens.FirstOrDefaultAsync(g => g.MaGV == maGv);
            if (existing == null)
            {
                return false;
            }

            _context.GiangViens.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(string maGv)
        {
            return await _context.GiangViens.AnyAsync(g => g.MaGV == maGv);
        }
    }
}
