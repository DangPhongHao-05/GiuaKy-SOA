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

	public async Task<DangKyDto?> create(DangKyDto dangKyDto) {
		SinhVienDto? sinhVienDto = await sinhVienServiceImpl.get(dangKyDto.sinhVienId);
		DeTaiDto? deTaiDto = await deTaiServiceImpl.get(dangKyDto.deTaiId);
		GiangVienDto? giangVienDto = await giangVienServiceImpl.get(dangKyDto.giangVienId);

		if ((sinhVienDto is null) || (deTaiDto is null) || (giangVienDto is null)) {
			return null;
		}

		bool dangKyExists = await postgresContext.DangKies.AnyAsync(item =>
			item.SinhvienId == dangKyDto.sinhVienId
			&& item.DetaiId == dangKyDto.deTaiId
		);

		if (dangKyExists) {
			return null;
		}

		DangKy newDangKy = new DangKy();
		newDangKy.SinhvienId = dangKyDto.sinhVienId;
		newDangKy.DetaiId = dangKyDto.deTaiId;
		newDangKy.GiangvienId = dangKyDto.giangVienId;

		postgresContext.DangKies.Add(newDangKy);
		await postgresContext.SaveChangesAsync();

		DangKyDto response = new DangKyDto();
		response.sinhVienId = dangKyDto.sinhVienId;
		response.deTaiId = dangKyDto.deTaiId;
		response.giangVienId = dangKyDto.giangVienId;

		return response;
	}

}