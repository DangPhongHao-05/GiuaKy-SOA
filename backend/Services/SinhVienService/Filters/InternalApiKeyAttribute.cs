using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SinhVienService.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class InternalApiKeyAttribute : Attribute, IAsyncActionFilter
    {
        private const string APIKEY_HEADER_NAME = "X-Internal-Secret";

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // 1. Kiểm tra xem request có header "X-Internal-Secret" không
            if (!context.HttpContext.Request.Headers.TryGetValue(APIKEY_HEADER_NAME, out var extractedApiKey))
            {
                context.Result = new UnauthorizedObjectResult("Thiếu Internal API Key.");
                return;
            }

            // 2. Lấy secret key từ appsettings.json của SinhVienService
            var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var expectedApiKey = configuration["InternalAuth:SecretKey"];

            // 3. So sánh 2 chuỗi
            if (!expectedApiKey.Equals(extractedApiKey))
            {
                context.Result = new UnauthorizedObjectResult("Internal API Key không hợp lệ.");
                return;
            }

            // Nếu đúng, cho phép đi tiếp vào Controller
            await next();
        }
    }
}