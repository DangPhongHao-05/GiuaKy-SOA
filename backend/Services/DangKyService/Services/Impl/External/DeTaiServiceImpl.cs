namespace DangKyService.Services.Impl.External;

public class DeTaiServiceImpl(
	HttpClient httpClient
) {

	private readonly HttpClient httpClient = httpClient;

	private static readonly string PREFIX = "/api/detai";

	public async Task<DeTaiDto?> get(long? id) {
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

		return await response.Content.ReadFromJsonAsync<DeTaiDto>();
	}

}