public class DangKyResponseDto {

	public DangKyResponseDto() {
	}

	public DangKyResponseDto(long? sinhVienId, long? deTaiId, long? giangVienId) {
		this.sinhVienId = sinhVienId;
		this.deTaiId = deTaiId;
		this.giangVienId = giangVienId;
	}

	public long? sinhVienId { get; set; } = null;
	public long? deTaiId { get; set; } = null;
	public long? giangVienId { get; set; } = null;

}