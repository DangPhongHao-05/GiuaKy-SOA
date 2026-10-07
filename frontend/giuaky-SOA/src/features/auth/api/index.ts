import { authClient } from "../../../services/apiClients";
import { getServiceConfig } from "../../../config/apiConfig";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  VerifyOtpPayload,
} from "../types";

const getEndpoints = () => {
  const config = getServiceConfig("auth");
  return {
    login: config.endpoints.login || "/Auth/login",
    register: config.endpoints.register || "/Auth/register",
    verifyOtp: config.endpoints.verifyOtp || "/Auth/verify-otp",
  };
};

export const authApi = {
  // 1. API gửi yêu cầu đăng nhập (Server kiểm tra mật khẩu và gửi OTP qua email)
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const endpoints = getEndpoints();
    const response = await authClient.post<AuthResponse>(
      endpoints.login,
      payload,
    );
    return response.data;
  },

  // 2. API xác thực mã OTP người dùng nhập để lấy JWT Token
  verifyOtp: async (
    emailOrPayload: string | VerifyOtpPayload,
    otp?: string,
  ): Promise<TokenResponse> => {
    const endpoints = getEndpoints();
    const payload: VerifyOtpPayload =
      typeof emailOrPayload === "string"
        ? { email: emailOrPayload, otpCode: otp || "" }
        : emailOrPayload;

    const response = await authClient.post<TokenResponse>(
      endpoints.verifyOtp,
      payload,
    );
    return response.data;
  },

  // 3. API đăng ký tài khoản mới
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const endpoints = getEndpoints();

    // Map đổi tên biến trước khi gửi đi
    const dataToSend = {
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
      MaSv: payload.studentId,
    };

    const response = await authClient.post<AuthResponse>(
      endpoints.register,
      dataToSend,
    );
    return response.data;
  },
};
