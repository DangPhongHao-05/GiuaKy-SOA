namespace DangKyService.Services.Impl.External;

public class GiangVienServiceImpl(
	HttpClient httpClient
) {

	private readonly HttpClient httpClient = httpClient;

	private static readonly string PREFIX = "/api/giangvien";

	public async Task<GiangVienDto?> get(long? id) {
		if (id is null) {
			return null;
		}

		HttpResponseMessage response;
		try {
			response = await httpClient.GetAsync($"{PREFIX}/{id}");
		} catch (Exception e) {
			return null;
		}

		if (!response.IsSuccessStatusCode) {
			return null;
		}

		return await response.Content.ReadFromJsonAsync<GiangVienDto>();
	}

}