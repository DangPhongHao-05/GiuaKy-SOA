using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SinhVienService.Data;
using SinhVienService.Models;

namespace SinhVienService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SinhVienController : ControllerBase
    {
        private readonly SinhVienDbContext _db;

        public SinhVienController(SinhVienDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SinhVien>>> GetAll()
        {
            return await _db.SinhViens.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SinhVien>> Get(int id)
        {
            var sv = await _db.SinhViens.FindAsync(id);
            if (sv == null) return NotFound();
            return sv;
        }

        [HttpPost]
        public async Task<ActionResult<SinhVien>> Create(SinhVien sinhVien)
        {
            _db.SinhViens.Add(sinhVien);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = sinhVien.Id }, sinhVien);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, SinhVien sinhVien)
        {
            if (id != sinhVien.Id) return BadRequest();

            _db.Entry(sinhVien).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.SinhViens.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sv = await _db.SinhViens.FindAsync(id);
            if (sv == null) return NotFound();

            _db.SinhViens.Remove(sv);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
