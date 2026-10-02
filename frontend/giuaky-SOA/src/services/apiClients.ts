import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getServiceConfig } from '../config/apiConfig';
import { apiLogger } from './apiLogger';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _logId?: string;
        _startTime?: number;
        _serviceName?: string;
    }
}

/**
 * Tạo axios instance độc lập cho từng microservice với logging & auth token tự động
 */
function createServiceClient(serviceKey: 'auth' | 'sinhVien' | 'giangVien' | 'deTai' | 'dangKy'): AxiosInstance {
    const config = getServiceConfig(serviceKey);

    const client = axios.create({
        baseURL: config.baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 8000,
    });

    // Request interceptor
    client.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                requestConfig.headers.Authorization = `Bearer ${token}`;
            }

            requestConfig._serviceName = config.name;
            requestConfig._startTime = Date.now();

            const fullUrl = (requestConfig.baseURL || '') + (requestConfig.url || '');
            const method = (requestConfig.method?.toUpperCase() || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE';

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
        }
    );

    // Response interceptor
    client.interceptors.response.use(
        (response: AxiosResponse) => {
            const logId = response.config._logId;
            const startTime = response.config._startTime || Date.now();
            const latency = Date.now() - startTime;

            if (logId) {
                apiLogger.completeCall(logId, {
                    status: 'success',
                    statusCode: response.status,
                    responseTimeMs: latency,
                    responseBody: response.data,
                });
            }
            return response;
        },
        (error) => {
            const logId = error.config?._logId;
            const startTime = error.config?._startTime || Date.now();
            const latency = Date.now() - startTime;
            const status = error.response?.status;
            const responseData = error.response?.data;
            const errMsg = error.message || 'Lỗi mạng hoặc server không phản hồi';

            if (logId) {
                apiLogger.completeCall(logId, {
                    status: 'error',
                    statusCode: status,
                    responseTimeMs: latency,
                    responseBody: responseData,
                    errorMessage: `${errMsg} (${status || 'Network Error/CORS'})`,
                });
            }
            return Promise.reject(error);
        }
    );

    return client;
}

export const authClient = createServiceClient('auth');
export const sinhVienClient = createServiceClient('sinhVien');
export const giangVienClient = createServiceClient('giangVien');
export const deTaiClient = createServiceClient('deTai');
export const dangKyClient = createServiceClient('dangKy');
