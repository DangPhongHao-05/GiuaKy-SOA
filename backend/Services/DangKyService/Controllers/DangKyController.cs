using Microsoft.AspNetCore.Mvc;
using DangKyService.Services.Impl;

namespace DangKyService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DangKyController(
	DangKyServiceImpl dangKyServiceImpl
) : Controller {

	private readonly DangKyServiceImpl dangKyServiceImpl = dangKyServiceImpl;

	[HttpPost]
	public async Task<IActionResult> Register(
		[FromBody] DangKyDto dangKyDto
	) {
		Console.WriteLine(dangKyDto.sinhVienId);
		Console.WriteLine(dangKyDto.deTaiId);
		Console.WriteLine(dangKyDto.giangVienId);
		DangKyDto? response = await dangKyServiceImpl.create(dangKyDto);

		if (response is null) {
			return BadRequest();
		}

		return Ok(response);
	}

}