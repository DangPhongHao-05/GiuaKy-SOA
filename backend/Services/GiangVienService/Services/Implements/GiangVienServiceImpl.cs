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
                .OrderBy(g => g.Id)
                .ToListAsync();
        }

        public async Task<GiangVien?> GetByIdAsync(long id)
        {
            if (id <= 0)
            {
                return null;
            }

            return await _context.GiangViens
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<GiangVien> CreateAsync(CreateGiangVienDto dto)
        {
            var entity = new GiangVien
            {
                HoTen = dto.HoTen.Trim(),
                Email = dto.Email.Trim(),
                BoMon = dto.BoMon?.Trim(),
                HocVi = dto.HocVi?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            if (dto.Id.HasValue && dto.Id.Value > 0)
            {
                entity.Id = dto.Id.Value;
            }

            entity.MaGV = !string.IsNullOrWhiteSpace(dto.MaGV)
                ? dto.MaGV.Trim()
                : (entity.Id > 0 ? $"GV{entity.Id:D3}" : null);

            _context.GiangViens.Add(entity);
            await _context.SaveChangesAsync();

            // Nếu maGV chưa có, tự động sinh từ Id vừa tạo
            if (string.IsNullOrWhiteSpace(entity.MaGV))
            {
                entity.MaGV = $"GV{entity.Id:D3}";
                await _context.SaveChangesAsync();
            }

            return entity;
        }

        public async Task<GiangVien?> UpdateAsync(long id, UpdateGiangVienDto dto)
        {
            if (id <= 0)
            {
                return null;
            }

            var existing = await _context.GiangViens.FirstOrDefaultAsync(g => g.Id == id);
            if (existing == null)
            {
                return null;
            }

            if (!string.IsNullOrWhiteSpace(dto.MaGV))
            {
                existing.MaGV = dto.MaGV.Trim();
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

        public async Task<bool> DeleteAsync(long id)
        {
            if (id <= 0)
            {
                return false;
            }

            var existing = await _context.GiangViens.FirstOrDefaultAsync(g => g.Id == id);
            if (existing == null)
            {
                return false;
            }

            _context.GiangViens.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(long id)
        {
            if (id <= 0)
            {
                return false;
            }

            return await _context.GiangViens.AnyAsync(g => g.Id == id);
        }
    }
}
