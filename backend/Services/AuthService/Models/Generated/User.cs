using System;
using System.Collections.Generic;

namespace AuthService.Models.Generated;

public partial class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string? FullName { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Role { get; set; }

    public string PasswordHash { get; set; } = null!;

    public bool? IsEmailVerified { get; set; }

    public string? OtpCode { get; set; }

    public DateTime? OtpExpiredAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
