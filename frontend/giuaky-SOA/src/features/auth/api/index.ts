import axiosClient from "../../../services/axiosClient";
import type { LoginPayload, RegisterPayload } from "../types";

export const authApi = {
  // 1. API gửi yêu cầu đăng nhập
  login: async (payload: LoginPayload) => {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
  },

  // 2. API xác thực mã OTP do người dùng nhập
  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosClient.post("/auth/verify-otp", {
      email: email,
      otpCode: otp,
    });
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await axiosClient.post('/auth/register', payload);
    return response.data;
  },
};
