export interface AuthResponse {
    success: boolean;
    message: string;
    requireOtp?: boolean;
}

export interface TokenResponse extends AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface VerifyOtpPayload {
    email: string;
    otpCode: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
}