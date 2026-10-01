using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DeTaiService.Data;
using DeTaiService.Models;

namespace DeTaiService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeTaiController : ControllerBase
    {
        private readonly DeTaiDbContext _context;

        public DeTaiController(DeTaiDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH TẤT CẢ ĐỀ TÀI (GET: api/DeTai)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeTai>>> GetDeTais()
        {
             return await _context.DeTais.ToListAsync();
        }

        // 2. LẤY 1 ĐỀ TÀI THEO ID (GET: api/DeTai/5)
        [HttpGet("{id}")]
        public async Task<ActionResult<DeTai>> GetDeTai(long id)
        {
            var deTai = await _context.DeTais.FindAsync(id);

            if (deTai == null)
            {
                return NotFound(new { message = "Không tìm thấy đề tài" });
            }

            return deTai;
        }

        // 3. THÊM MỚI ĐỀ TÀI (POST: api/DeTai)
        [HttpPost]
        public async Task<ActionResult<DeTai>> PostDeTai(DeTai deTai)
        {
            _context.DeTais.Add(deTai);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDeTai), new { id = deTai.Id }, deTai);
        }

        // 4. SỬA ĐỀ TÀI (PUT: api/DeTai/5)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeTai(long id, DeTai deTai)
        {
            if (id != deTai.Id)
            {
                return BadRequest(new { message = "ID không trùng khớp" });
            }

            _context.Entry(deTai).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DeTais.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Không tìm thấy đề tài để cập nhật" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật thành công", data = deTai });
        }

        // 5. XÓA ĐỀ TÀI (DELETE: api/DeTai/5)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeTai(long id)
        {
            var deTai = await _context.DeTais.FindAsync(id);
            if (deTai == null)
            {
                return NotFound(new { message = "Không tìm thấy đề tài" });
            }

            _context.DeTais.Remove(deTai);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa đề tài thành công" });
        }
    }
}