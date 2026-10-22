/**
 * Cấu hình tập trung toàn bộ endpoint của các Microservice SOA.
 * Giúp thay đổi port/domain hoặc endpoint mà không ảnh hưởng tới UI logic.
 */

export interface ServiceEndpointConfig {
  name: string;
  key: "auth" | "sinhVien" | "giangVien" | "deTai" | "dangKy";
  displayName: string;
  baseURL: string;
  endpoints: Record<string, string>;
  port: number;
  color: string;
  description: string;
  isImplemented: boolean;
}

// Định nghĩa cổng của API Gateway một lần ở đây
const API_GATEWAY_URL = "https://localhost:7000/api";

export const DEFAULT_SERVICE_CONFIG: Record<string, ServiceEndpointConfig> = {
  auth: {
    key: "auth",
    name: "AuthService",
    displayName: "Dịch vụ Xác thực & Người dùng",
    baseURL: API_GATEWAY_URL, // <-- Đổi về Gateway
    endpoints: {
      login: "/Auth/login",
      register: "/Auth/register",
      verifyOtp: "/Auth/verify-otp",
      refreshToken: "/Auth/refresh-token",
    },
    port: 7001, // Vẫn giữ lại port cũ làm document/tham khảo
    color: "#2563eb",
    description:
      "Quản lý tài khoản, mã hóa mật khẩu và xác thực 2 lớp qua email (OTP)",
    isImplemented: true,
  },
  sinhVien: {
    key: "sinhVien",
    name: "SinhVienService",
    displayName: "Dịch vụ Quản lý Sinh viên",
    baseURL: API_GATEWAY_URL, // <-- Đổi về Gateway
    endpoints: {
      getAll: "/SinhVien",
      getById: "/SinhVien/:id",
      create: "/SinhVien",
      update: "/SinhVien/:id",
      delete: "/SinhVien/:id",
    },
    port: 7005,
    color: "#16a34a",
    description:
      "Quản lý danh sách sinh viên, thông tin lớp, khoa và niên khóa",
    isImplemented: true,
  },
  giangVien: {
    key: "giangVien",
    name: "GiangVienService",
    displayName: "Dịch vụ Quản lý Giảng viên",
    baseURL: API_GATEWAY_URL, // <-- Đổi về Gateway
    endpoints: {
      getAll: "/GiangVien",
      getById: "/GiangVien/:id",
      create: "/GiangVien",
      update: "/GiangVien/:id",
      delete: "/GiangVien/:id",
    },
    port: 7004,
    color: "#9333ea",
    description: "Quản lý thông tin giảng viên hướng dẫn, bộ môn và học vị",
    isImplemented: true,
  },
  deTai: {
    key: "deTai",
    name: "DeTaiService",
    displayName: "Dịch vụ Quản lý Đề tài",
    baseURL: API_GATEWAY_URL, // <-- Đổi về Gateway
    endpoints: {
      getAll: "/DeTai",
      getById: "/DeTai/:id",
      create: "/DeTai",
      update: "/DeTai/:id",
      delete: "/DeTai/:id",
    },
    port: 7003,
    color: "#ea580c",
    description:
      "Quản lý danh mục đề tài tốt nghiệp, tên đề tài và mô tả chi tiết",
    isImplemented: true,
  },
  dangKy: {
    key: "dangKy",
    name: "DangKyService",
    displayName: "Dịch vụ Quản lý Đăng ký Đồ án",
    baseURL: API_GATEWAY_URL, // <-- Đổi về Gateway
    endpoints: {
      getAll: "/DangKy",
      create: "/DangKy",
    },
    port: 7002,
    color: "#dc2626",
    description:
      "Kết nối Sinh viên, Đề tài và Giảng viên hướng dẫn qua DangKyService",
    isImplemented: true,
  },
};

// Cho phép lưu override baseURL tạm thời vào localStorage nếu người dùng muốn test port khác
const STORAGE_KEY = "soa_services_config_override";

export function getServiceConfig(
  key: keyof typeof DEFAULT_SERVICE_CONFIG,
): ServiceEndpointConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[key]) {
        return { ...DEFAULT_SERVICE_CONFIG[key], ...parsed[key] };
      }
    }
  } catch {
    // Fallback to default
  }
  return DEFAULT_SERVICE_CONFIG[key];
}

export function updateServiceBaseUrl(
  key: keyof typeof DEFAULT_SERVICE_CONFIG,
  newBaseUrl: string,
): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[key] = { ...parsed[key], baseURL: newBaseUrl };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore
  }
}
