import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getServiceConfig } from "../config/apiConfig";
import { apiLogger } from "./apiLogger";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _logId?: string;
    _startTime?: number;
    _serviceName?: string;
    _retry?: boolean;
  }
}

/**
 * Tạo axios instance độc lập cho từng microservice với logging & auth token tự động
 */
function createServiceClient(
  serviceKey: "auth" | "sinhVien" | "giangVien" | "deTai" | "dangKy",
): AxiosInstance {
  const config = getServiceConfig(serviceKey);

  const client = axios.create({
    baseURL: config.baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 8000,
  });

  // Request interceptor
  client.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }

      requestConfig._serviceName = config.name;
      requestConfig._startTime = Date.now();

      const fullUrl = (requestConfig.baseURL || "") + (requestConfig.url || "");
      const method = (requestConfig.method?.toUpperCase() || "GET") as
        | "GET"
        | "POST"
        | "PUT"
        | "DELETE";

      const logId = apiLogger.startCall({
        serviceName: config.name,
        method,
        url: fullUrl,
        requestBody: requestConfig.data,
      });

      requestConfig._logId = logId;
      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const logId = response.config._logId;
      const startTime = response.config._startTime || Date.now();
      const latency = Date.now() - startTime;

      if (logId) {
        apiLogger.completeCall(logId, {
          status: "success",
          statusCode: response.status,
          responseTimeMs: latency,
          responseBody: response.data,
        });
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;
      const logId = originalRequest?._logId;
      const startTime = originalRequest?._startTime || Date.now();
      const latency = Date.now() - startTime;
      const status = error.response?.status;
      const responseData = error.response?.data;
      const errMsg = error.message || "Lỗi mạng hoặc server không phản hồi";

      if (logId) {
        apiLogger.completeCall(logId, {
          status: "error",
          statusCode: status,
          responseTimeMs: latency,
          responseBody: responseData,
          errorMessage: `${errMsg} (${status || "Network Error/CORS"})`,
        });
      }
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Đánh dấu là đã thử refresh để không bị lặp vô tận

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const userId = localStorage.getItem("userId");

          if (!refreshToken || !userId) {
            throw new Error(
              "Thiếu Refresh Token hoặc UserId trong LocalStorage",
            );
          }

          // Lấy cấu hình của AuthService để biết URL
          const authConfig = getServiceConfig("auth");
          const refreshUrl = `${authConfig.baseURL}${authConfig.endpoints?.refreshToken || "/Auth/refresh-token"}`;

          // DÙNG AXIOS ĐỘC LẬP (không dùng authClient) để gọi lên server
          const response = await axios.post(refreshUrl, {
            userId: userId,
            refreshToken: refreshToken,
          });

          if (response.data && response.data.success) {
            // Lưu token mới vào LocalStorage
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            // Gắn token mới vào request bị lỗi cũ và gọi lại request đó
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return client(originalRequest);
          } else {
            throw new Error("Refresh Token bị từ chối");
          }
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          localStorage.removeItem('userEmail');

          // Chuyển hướng người dùng về Login (Có thể điều chỉnh theo Router của bạn)
          window.location.href = "/";

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export const authClient = createServiceClient("auth");
export const sinhVienClient = createServiceClient("sinhVien");
export const giangVienClient = createServiceClient("giangVien");
export const deTaiClient = createServiceClient("deTai");
export const dangKyClient = createServiceClient("dangKy");
