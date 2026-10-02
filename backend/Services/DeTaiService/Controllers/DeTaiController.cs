using DeTaiService.Data;
using DeTaiService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeTaiService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeTaiController : ControllerBase
    {
        private readonly DeTaiDbContext _context;

        public DeTaiController(DeTaiDbContext context)
        {
            _context = context;
        }

        // 1. READ ALL - Lấy danh sách in ra màn hình web
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var danhSach = await _context.DeTais.ToListAsync();
            return Ok(danhSach);
        }

        // 2. READ BY ID - Lấy thông tin 1 đề tài theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var deTai = await _context.DeTais.FindAsync(id);
            if (deTai == null)
            {
                return NotFound(new { message = "Không tìm thấy đề tài!" });
            }
            return Ok(deTai);
        }

        // 3. CREATE - Thêm mới đề tài
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DeTai deTai)
        {
            _context.DeTais.Add(deTai);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = deTai.Id }, deTai);
        }

        // 4. UPDATE - Sửa thông tin đề tài theo ID (Không bắt buộc truyền id trong Body)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] DeTai deTaiUpdate)
        {
            var deTai = await _context.DeTais.FindAsync(id);
            if (deTai == null)
            {
                return NotFound(new { message = "Không tìm thấy đề tài để cập nhật!" });
            }

            // Gán/cập nhật tất cả thông tin từ body truyền lên
            deTai.TenDeTai = deTaiUpdate.TenDeTai;
            deTai.MoTa = deTaiUpdate.MoTa;

            // Nếu model DeTai.cs của bạn có 2 thuộc tính LinhVuc và TrangThai thì bỏ comment 2 dòng dưới:
            // deTai.LinhVuc = deTaiUpdate.LinhVuc;
            // deTai.TrangThai = deTaiUpdate.TrangThai;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!", data = deTai });
        }

        // 5. DELETE - Xóa đề tài theo ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var deTai = await _context.DeTais.FindAsync(id);
            if (deTai == null)
            {
                return NotFound(new { message = "Không tìm thấy đề tài để xóa!" });
            }

            _context.DeTais.Remove(deTai);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa đề tài thành công!" });
        }
    }
}