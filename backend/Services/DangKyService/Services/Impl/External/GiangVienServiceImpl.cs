using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace DangKyService.Services.Impl.External;

public class GiangVienServiceImpl(
	HttpClient httpClient
) {
	private readonly HttpClient httpClient = httpClient;

	private static readonly string PREFIX = "/api/giangvien";

	public async Task<GiangVienDto?> get(long? id, string token) {
		if (id is null) {
			return null;
		}

		using var request = new HttpRequestMessage(
			HttpMethod.Get,
			$"{PREFIX}/{id}"
		);

		request.Headers.Authorization =
			new AuthenticationHeaderValue("Bearer", token);

		try {
			using var response = await httpClient.SendAsync(request);

			if (!response.IsSuccessStatusCode) {
				return null;
			}

			return await response.Content.ReadFromJsonAsync<GiangVienDto>();
		} catch (HttpRequestException) {
			return null;
		}
	}
}