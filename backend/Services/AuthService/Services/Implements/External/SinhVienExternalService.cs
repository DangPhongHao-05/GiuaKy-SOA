using AuthService.DTOs;

namespace AuthService.Services.Implements.External
{
    public class SinhVienExternalService
    {
        private readonly HttpClient _httpClient;
        private static readonly string PREFIX = "api/sinhvien";

        public SinhVienExternalService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> CreateSinhVienAsync(SinhVienCreateRequest request)
        {
            try
            {
                // Gửi HTTP POST request tới SinhVienService
                HttpResponseMessage response = await _httpClient.PostAsJsonAsync(PREFIX, request);

                return response.IsSuccessStatusCode;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
