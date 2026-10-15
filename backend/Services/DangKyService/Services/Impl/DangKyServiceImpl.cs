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

	public async Task<DangKyResponseDto?> create(DangKyRequestDto request) {
		//SinhVienDto? sinhVienDto = await sinhVienServiceImpl.get(request.sinhVienId);
		//DeTaiDto? deTaiDto = await deTaiServiceImpl.get(request.deTaiId);
		//GiangVienDto? giangVienDto = await giangVienServiceImpl.get(request.giangVienId);

		//if ((sinhVienDto is null) || (deTaiDto is null) || (giangVienDto is null)) {
		//	return null;
		//}

		//bool dangKyExists = await postgresContext.DangKies.AnyAsync(item =>
		//	item.SinhvienId == request.sinhVienId
		//	&& item.DetaiId == request.deTaiId
		//);

		//if (dangKyExists) {
		//	return null;
		//}

		DangKy added_dangKy = postgresContext.DangKies.Add(DangKyMapper.mapRequestToEntity(request)).Entity;
		await postgresContext.SaveChangesAsync();

		return DangKyMapper.mapEntityToResponse(added_dangKy);
	}

	public async Task<DangKyResponseDto?> update(DangKyRequestDto request) {
		SinhVienDto? sinhVienDto = await sinhVienServiceImpl.get(request.sinhVienId);
		DeTaiDto? deTaiDto = await deTaiServiceImpl.get(request.deTaiId);
		GiangVienDto? giangVienDto = null;

		if (request.giangVienId is not null) {
			giangVienDto = await giangVienServiceImpl.get(request.giangVienId);
		}

		if ((sinhVienDto is null) || (deTaiDto is null)) {
			return null;
		}

		if (!await exists(request)) {
			return null;
		}

		DangKy updated_dangKy = postgresContext.DangKies.Update(DangKyMapper.mapRequestToEntity(request)).Entity;
		await postgresContext.SaveChangesAsync();

		return DangKyMapper.mapEntityToResponse(updated_dangKy);
	}

	public async Task<bool> exists(DangKyRequestDto request) {
		return await postgresContext.DangKies.AnyAsync(item =>
			item.SinhvienId == request.sinhVienId
			&& item.DetaiId == request.deTaiId
		);
	}

}