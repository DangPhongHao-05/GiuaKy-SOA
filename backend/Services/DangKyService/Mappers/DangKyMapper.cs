using DangKyService.Models;

namespace DangKyService.Mappers;

public static class DangKyMapper {

	public static DangKyRequestDto mapEntityToRequest(DangKy entity) {
		DangKyRequestDto request = new DangKyRequestDto(
			entity.SinhvienId,
			entity.DetaiId,
			entity.GiangvienId
		);

		return request;
	}

	public static DangKy mapRequestToEntity(DangKyRequestDto request) {
		DangKy entity = new DangKy();
		entity.SinhvienId = request.sinhVienId;
		entity.DetaiId = request.deTaiId;
		entity.GiangvienId = request.giangVienId;

		return entity;
	}

	public static DangKyResponseDto mapEntityToResponse(DangKy entity) {
		DangKyResponseDto response = new DangKyResponseDto(
			entity.SinhvienId,
			entity.DetaiId,
			entity.GiangvienId
		);

		return response;
	}

	public static DangKy mapResponseToEntity(DangKyResponseDto response) {
		DangKy entity = new DangKy();
		entity.SinhvienId = response.sinhVienId;
		entity.DetaiId = response.deTaiId;
		entity.GiangvienId = response.giangVienId;

		return entity;
	}

}