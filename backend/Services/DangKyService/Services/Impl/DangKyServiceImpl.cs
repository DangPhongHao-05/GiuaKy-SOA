using DangKyService.Mappers;
using DangKyService.Models;
using DangKyService.Services.Impl.External;
using Microsoft.EntityFrameworkCore;

namespace DangKyService.Services.Impl;

public class DangKyServiceImpl(
	PostgresContext postgresContext,
	SinhVienServiceImpl sinhVienServiceImpl,
	DeTaiServiceImpl deTaiServiceImpl,
	GiangVienServiceImpl giangVienServiceImpl
) {

	private readonly PostgresContext postgresContext = postgresContext;
	private readonly SinhVienServiceImpl sinhVienServiceImpl = sinhVienServiceImpl;
	private readonly DeTaiServiceImpl deTaiServiceImpl = deTaiServiceImpl;
	private readonly GiangVienServiceImpl giangVienServiceImpl = giangVienServiceImpl;

	public async Task<DangKyResponseDto?> get(long id) {
		DangKy? dangKy = await postgresContext
			.DangKies
			.AsNoTracking()
			.FirstOrDefaultAsync(item => item.Id == id);

		if (dangKy is null) {
			return null;
		}

		return DangKyMapper.mapEntityToResponse(dangKy);
	}

	public async Task<List<DangKyResponseDto>> getList() {
		List<DangKy> dangKyList = await postgresContext
			.DangKies
			.AsNoTracking()
			.ToListAsync();
		List<DangKyResponseDto> dangKyDtoList = new List<DangKyResponseDto>();

		foreach (DangKy dangKy in dangKyList) {
			dangKyDtoList.Add(
				DangKyMapper.mapEntityToResponse(dangKy)
			);
		}

		return dangKyDtoList;
	}

	public async Task<DangKyResponseDto?> create(string token, DangKyRequestDto request) {
		Console.WriteLine(request.sinhVienId);
		Console.WriteLine(request.deTaiId);
		Console.WriteLine(request.giangVienId);

		SinhVienDto? sinhVienDto = await sinhVienServiceImpl.get(request.sinhVienId, token);
		DeTaiDto? deTaiDto = await deTaiServiceImpl.get(request.deTaiId, token);
		GiangVienDto? giangVienDto = await giangVienServiceImpl.get(request.giangVienId, token);

		if ((sinhVienDto is null) || (deTaiDto is null) || (giangVienDto is null)) {
			Console.WriteLine("any null");
			if (sinhVienDto is null) {
				Console.WriteLine("sv null");
			}
			if (deTaiDto is null) {
				Console.WriteLine("dt null");
			}
			if (giangVienDto is null) {
				Console.WriteLine("gv null");
			}
			return null;
		}

		if (await exists(request)) {
			Console.WriteLine("exists");
			return null;
		}

		DangKy added_dangKy = postgresContext.DangKies.Add(DangKyMapper.mapRequestToEntity(request)).Entity;
		await postgresContext.SaveChangesAsync();

		return DangKyMapper.mapEntityToResponse(added_dangKy);
	}

	//public async Task<DangKyResponseDto?> update(DangKyRequestDto request) {
	//	SinhVienDto? sinhVienDto = await sinhVienServiceImpl.get(request.sinhVienId);
	//	DeTaiDto? deTaiDto = await deTaiServiceImpl.get(request.deTaiId);
	//	GiangVienDto? giangVienDto = null;

	//	if (request.giangVienId is not null) {
	//		giangVienDto = await giangVienServiceImpl.get(request.giangVienId);
	//	}

	//	if ((sinhVienDto is null) || (deTaiDto is null)) {
	//		return null;
	//	}

	//	if (!await exists(request)) {
	//		return null;
	//	}

	//	DangKy updated_dangKy = postgresContext.DangKies.Update(DangKyMapper.mapRequestToEntity(request)).Entity;
	//	await postgresContext.SaveChangesAsync();

	//	return DangKyMapper.mapEntityToResponse(updated_dangKy);
	//}

	public async Task<bool> exists(DangKyRequestDto request) {
		return await postgresContext.DangKies.AnyAsync(item =>
			item.SinhvienId == request.sinhVienId
			&& item.DetaiId == request.deTaiId
		);
	}

}