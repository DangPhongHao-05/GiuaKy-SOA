using System;
using System.Collections.Generic;

namespace AuthService.Models.Generated;

public partial class RefreshToken
{
    public long Id { get; set; }

    public Guid UserId { get; set; }

    public string TokenHash { get; set; } = null!;

    public bool? Revoked { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
