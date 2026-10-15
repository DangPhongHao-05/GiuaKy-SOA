using Microsoft.AspNetCore.Mvc;
using DangKyService.Services.Impl;
using Microsoft.AspNetCore.Authorization;

namespace DangKyService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
		DangKyResponseDto? response = await dangKyServiceImpl.create(request);

		if (response is null) {
			return BadRequest();
		}

		return Ok(response);
	}

	public async Task<IActionResult> update(
		[FromBody] DangKyRequestDto request
	) {
		//
	}

}