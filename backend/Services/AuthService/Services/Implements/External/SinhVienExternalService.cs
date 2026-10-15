using AuthService.DTOs;
using Microsoft.Extensions.Configuration;

namespace AuthService.Services.Implements.External
{
    public class SinhVienExternalService
    {
        private readonly HttpClient _httpClient;
        private readonly string _secretKey;
        private static readonly string PREFIX = "api/sinhvien";

        // SỬA string secretKey THÀNH IConfiguration configuration
        public SinhVienExternalService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;

            // Tự đọc chuỗi secret từ file cấu hình (đảm bảo key này khớp với appsettings.json)
            _secretKey = configuration["InternalAuth:SecretKey"];
        }

        public async Task<bool> CreateSinhVienAsync(SinhVienCreateRequest request)
        {
            try
            {
                // Gắn Internal API Key vào Header
                _httpClient.DefaultRequestHeaders.Add("X-Internal-Secret", _secretKey);

                HttpResponseMessage response = await _httpClient.PostAsJsonAsync(PREFIX, request);

                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[LỖI GỌI SINHVIEN SERVICE]: {errorContent}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EXCEPTION]: {ex.Message}");
                return false;
            }
        }
    }
}