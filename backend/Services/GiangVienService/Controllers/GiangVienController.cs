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
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var danhSach = await _service.GetAllAsync();
                return Ok(danhSach);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    message = "Đã xảy ra lỗi trên hệ thống khi tải danh sách giảng viên",
                    error = ex.Message
                });
            }
        }

        // 2. GET: /api/GiangVien/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Mã định danh giảng viên không hợp lệ" });
                }

                var gv = await _service.GetByIdAsync(id);
                if (gv == null)
                {
                    return NotFound(new { message = $"Không tìm thấy giảng viên với mã: {id}" });
                }

                return Ok(gv);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    message = $"Đã xảy ra lỗi trên hệ thống khi tìm giảng viên với mã: {id}",
                    error = ex.Message
                });
            }
        }

        // 3. POST: /api/GiangVien
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateGiangVienDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (dto.Id.HasValue && dto.Id.Value > 0 && await _service.ExistsAsync(dto.Id.Value))
                {
                    return BadRequest(new { message = $"Giảng viên với id '{dto.Id.Value}' đã tồn tại trong hệ thống!" });
                }

                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    message = "Đã xảy ra lỗi trên hệ thống khi tạo mới giảng viên",
                    error = ex.Message
                });
            }
        }

        // 4. PUT: /api/GiangVien/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateGiangVienDto dto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Mã định danh giảng viên không hợp lệ" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updated = await _service.UpdateAsync(id, dto);
                if (updated == null)
                {
                    return NotFound(new { message = $"Không tìm thấy giảng viên với mã: {id} để cập nhật!" });
                }

                return Ok(new
                {
                    message = "Cập nhật giảng viên thành công!",
                    data = updated
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    message = $"Đã xảy ra lỗi trên hệ thống khi cập nhật giảng viên với mã: {id}",
                    error = ex.Message
                });
            }
        }

        // 5. DELETE: /api/GiangVien/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { message = "Mã định danh giảng viên không hợp lệ" });
                }

                var deleted = await _service.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Không tìm thấy giảng viên với mã: {id} để xóa!" });
                }

                return Ok(new { message = "Đã xóa giảng viên thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    message = $"Đã xảy ra lỗi trên hệ thống khi xóa giảng viên với mã: {id}",
                    error = ex.Message
                });
            }
        }
    }
}
