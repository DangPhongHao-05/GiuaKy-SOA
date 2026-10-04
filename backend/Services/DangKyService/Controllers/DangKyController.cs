using Microsoft.AspNetCore.Mvc;
using DangKyService.Services.Impl;

namespace DangKyService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DangKyController(
	DangKyServiceImpl dangKyServiceImpl
) : Controller {

	private readonly DangKyServiceImpl dangKyServiceImpl = dangKyServiceImpl;

	[HttpGet]
	public async Task<IActionResult> getList() {
		List<DangKyResponseDto> response = await dangKyServiceImpl.getList();

		return Ok(response);
	}

	[HttpPost]
	public async Task<IActionResult> create(
		[FromBody] DangKyRequestDto request
	) {
		Console.WriteLine(request.sinhVienId);
		Console.WriteLine(request.deTaiId);
		Console.WriteLine(request.giangVienId);
		DangKyResponseDto? response = await dangKyServiceImpl.create(request);

		if (response is null) {
			return BadRequest();
		}

		return Ok(response);
	}

}