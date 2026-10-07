using GiangVienService.DTOs;
using GiangVienService.Models;
using GiangVienService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiangVienService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GiangVienController : ControllerBase
    {
        private readonly IGiangVienService _service;

        public GiangVienController(IGiangVienService service)
        {
            _service = service;
        }

        // 1. GET: /api/GiangVien
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GiangVien>>> GetAll()
        {
            var danhSach = await _service.GetAllAsync();
            return Ok(danhSach);
        }

        // 2. GET: /api/GiangVien/{maGv}
        [HttpGet("{maGv}")]
        public async Task<ActionResult<GiangVien>> GetByMaGv(string maGv)
        {
            var gv = await _service.GetByMaGvAsync(maGv);
            if (gv == null)
            {
                return NotFound(new { message = $"Không tìm thấy giảng viên với mã: {maGv}" });
            }
            return Ok(gv);
        }

        // 3. POST: /api/GiangVien
        [HttpPost]
        public async Task<ActionResult<GiangVien>> Create([FromBody] CreateGiangVienDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _service.ExistsAsync(dto.MaGV.Trim()))
            {
                return BadRequest(new { message = $"Mã giảng viên '{dto.MaGV}' đã tồn tại trong hệ thống!" });
            }

            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetByMaGv), new { maGv = created.MaGV }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo mới giảng viên", error = ex.Message });
            }
        }

        // 4. PUT: /api/GiangVien/{maGv}
        [HttpPut("{maGv}")]
        public async Task<IActionResult> Update(string maGv, [FromBody] UpdateGiangVienDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updated = await _service.UpdateAsync(maGv, dto);
                if (updated == null)
                {
                    return NotFound(new { message = $"Không tìm thấy giảng viên với mã: {maGv} để cập nhật!" });
                }

                return Ok(new { message = "Cập nhật giảng viên thành công!", data = updated });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật giảng viên", error = ex.Message });
            }
        }

        // 5. DELETE: /api/GiangVien/{maGv}
        [HttpDelete("{maGv}")]
        public async Task<IActionResult> Delete(string maGv)
        {
            try
            {
                var deleted = await _service.DeleteAsync(maGv);
                if (!deleted)
                {
                    return NotFound(new { message = $"Không tìm thấy giảng viên với mã: {maGv} để xóa!" });
                }

                return Ok(new { message = "Đã xóa giảng viên thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa giảng viên", error = ex.Message });
            }
        }
    }
}
