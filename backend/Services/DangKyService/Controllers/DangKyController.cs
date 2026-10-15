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
		string? authorization = Request.Headers.Authorization;

		if (string.IsNullOrEmpty(authorization)) {
			return Unauthorized("Missing Authorization header");
		}

		// authorization có dạng: Bearer eyJhbGciOi...
		string? token = authorization.StartsWith(
			"Bearer ",
			StringComparison.OrdinalIgnoreCase
		)
			? authorization["Bearer ".Length..].Trim()
			: null;

		if (string.IsNullOrEmpty(token)) {
			return Unauthorized("Invalid Bearer Token");
		}

		DangKyResponseDto? response = await dangKyServiceImpl.create(token, request);

		if (response is null) {
			return BadRequest();
		}

		return Ok(response);
	}

	//[HttpPatch]
	//public async Task<IActionResult> update(
	//	[FromBody] DangKyRequestDto request
	//) {
	//	DangKyResponseDto? response = await dangKyServiceImpl.update(request);

	//	if (response is null) {
	//		return BadRequest();
	//	}

	//	return Ok(response);
	//}

}