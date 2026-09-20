using AuthService.Services.Interfaces;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;

namespace AuthService.Services.Implements
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otpCode)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = "Mã xác thực đăng nhập hệ thống";

            var builder = new BodyBuilder
            {
                HtmlBody = $"<h3>Mã xác thực (OTP) của bạn là: <strong style='color:blue;'>{otpCode}</strong></h3><p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.</p>"
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            // Đọc cấu hình từ appsettings.json hoặc secrets.json
            var smtpServer = _config["EmailSettings:SmtpServer"];
            var port = int.Parse(_config["EmailSettings:Port"] ?? "587");
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var password = _config["EmailSettings:Password"];

            await smtp.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
