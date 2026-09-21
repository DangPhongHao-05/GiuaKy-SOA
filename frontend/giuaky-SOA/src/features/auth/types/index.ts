export interface AuthResponse {
  success: boolean;
  message: string;
  requireOtp?: boolean;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  fullName: string;
}