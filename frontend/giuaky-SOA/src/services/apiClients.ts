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

// ==========================================
// CÁC BIẾN QUẢN LÝ HÀNG ĐỢI REFRESH TOKEN
// ==========================================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Hàm tiện ích: Trích xuất UserId (sub) trực tiếp từ Access Token
const getUserIdFromToken = (token: string): string | null => {
  try {
    const payloadBase64Url = token.split(".")[1];
    const payloadBase64 = payloadBase64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payloadJson = decodeURIComponent(
      atob(payloadBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(payloadJson);
    return payload.sub || payload.nameid || null;
  } catch (e) {
    return null;
  }
};

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

  // ==========================================
  // REQUEST INTERCEPTOR
  // ==========================================
  client.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      // SỬA: Đọc đúng key accessToken
      let token = localStorage.getItem("accessToken");
      if (token) {
        token = token.replace(/^"|"$/g, "");
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

  // ==========================================
  // RESPONSE INTERCEPTOR
  // ==========================================
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

      // XỬ LÝ LỖI 401 UNAUTHORIZED
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Đánh dấu là đã thử refresh

        // NẾU HỆ THỐNG ĐANG ĐI LẤY TOKEN -> Đưa request này vào hàng đợi
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest); // Chạy lại request bị nghẽn
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // BẮT ĐẦU QUÁ TRÌNH REFRESH TOKEN
        isRefreshing = true;

        try {
          // SỬA: Lấy đúng key refreshToken
          let refreshToken = localStorage.getItem("refreshToken");
          let oldAccessToken = localStorage.getItem("accessToken");

          if (refreshToken) refreshToken = refreshToken.replace(/^"|"$/g, "");
          if (oldAccessToken)
            oldAccessToken = oldAccessToken.replace(/^"|"$/g, "");

          // SỬA: Tự động trích xuất userId từ AccessToken cũ thay vì phụ thuộc Zustand
          const userId = oldAccessToken
            ? getUserIdFromToken(oldAccessToken)
            : null;

          if (!refreshToken || !userId) {
            throw new Error("Thiếu Refresh Token hoặc UserId");
          }

          const authConfig = getServiceConfig("auth");
          const refreshUrl = `${authConfig.baseURL}${authConfig.endpoints?.refreshToken || "/api/Auth/refresh-token"}`;

          const response = await axios.post(refreshUrl, {
            userId: userId,
            refreshToken: refreshToken,
          });

          if (response.data && response.data.success) {
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            // SỬA: Lưu token mới theo đúng tên key
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return client(originalRequest);
          } else {
            throw new Error("Refresh Token bị từ chối");
          }
        } catch (refreshError: any) {
          console.error(
            "LỖI REFRESH TOKEN:",
            refreshError.response?.data || refreshError.message,
          );

          processQueue(refreshError, null);

          // SỬA: Xóa đúng tên key
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("auth-storage");

          // Bật lại nếu muốn đá văng ra Login
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
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
