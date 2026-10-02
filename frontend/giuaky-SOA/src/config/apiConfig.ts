/**
 * Cấu hình tập trung toàn bộ endpoint của các Microservice SOA.
 * Giúp thay đổi port/domain hoặc endpoint mà không ảnh hưởng tới UI logic.
 */

export interface ServiceEndpointConfig {
    name: string;
    key: 'auth' | 'sinhVien' | 'giangVien' | 'deTai' | 'dangKy';
    displayName: string;
    baseURL: string;
    endpoints: Record<string, string>;
    port: number;
    color: string;
    description: string;
    isImplemented: boolean;
}

export const DEFAULT_SERVICE_CONFIG: Record<string, ServiceEndpointConfig> = {
    auth: {
        key: 'auth',
        name: 'AuthService',
        displayName: 'Dịch vụ Xác thực & Người dùng',
        baseURL: 'https://localhost:7001/api',
        endpoints: {
            login: '/Auth/login',
            register: '/Auth/register',
            verifyOtp: '/Auth/verify-otp',
        },
        port: 7001,
        color: '#2563eb', // blue
        description: 'Quản lý tài khoản, mã hóa mật khẩu và xác thực 2 lớp qua email (OTP)',
        isImplemented: true,
    },
    sinhVien: {
        key: 'sinhVien',
        name: 'SinhVienService',
        displayName: 'Dịch vụ Quản lý Sinh viên',
        baseURL: 'http://localhost:5005/api',
        endpoints: {
            getAll: '/SinhVien',
            getById: '/SinhVien/:id',
            create: '/SinhVien',
            update: '/SinhVien/:id',
            delete: '/SinhVien/:id',
        },
        port: 5005,
        color: '#16a34a', // green
        description: 'Quản lý danh sách sinh viên, thông tin lớp, khoa và niên khóa',
        isImplemented: false,
    },
    giangVien: {
        key: 'giangVien',
        name: 'GiangVienService',
        displayName: 'Dịch vụ Quản lý Giảng viên',
        baseURL: 'http://localhost:5004/api',
        endpoints: {
            getAll: '/GiangVien',
            getById: '/GiangVien/:id',
            create: '/GiangVien',
            update: '/GiangVien/:id',
            delete: '/GiangVien/:id',
        },
        port: 5004,
        color: '#9333ea', // purple
        description: 'Quản lý thông tin giảng viên hướng dẫn, bộ môn và học vị',
        isImplemented: false,
    },
    deTai: {
        key: 'deTai',
        name: 'DeTaiService',
        displayName: 'Dịch vụ Quản lý Đề tài',
        baseURL: 'http://localhost:5003/api',
        endpoints: {
            getAll: '/DeTai',
            getById: '/DeTai/:id',
            create: '/DeTai',
            update: '/DeTai/:id',
            delete: '/DeTai/:id',
        },
        port: 5003,
        color: '#ea580c', // orange
        description: 'Quản lý danh mục đề tài tốt nghiệp, tên đề tài và mô tả chi tiết',
        isImplemented: true,
    },
    dangKy: {
        key: 'dangKy',
        name: 'DangKyService',
        displayName: 'Dịch vụ Quản lý Đăng ký Đồ án',
        baseURL: 'http://localhost:5002/api',
        endpoints: {
            getAll: '/DangKy',
            getById: '/DangKy/:id',
            create: '/DangKy',
            update: '/DangKy/:id',
            delete: '/DangKy/:id',
        },
        port: 5002,
        color: '#dc2626', // red
        description: 'Kết nối Sinh viên và Đề tài, quản lý quy trình xét duyệt đăng ký',
        isImplemented: false,
    },
};

// Cho phép lưu override baseURL tạm thời vào localStorage nếu người dùng muốn test port khác
const STORAGE_KEY = 'soa_services_config_override';

export function getServiceConfig(key: keyof typeof DEFAULT_SERVICE_CONFIG): ServiceEndpointConfig {
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

export function updateServiceBaseUrl(key: keyof typeof DEFAULT_SERVICE_CONFIG, newBaseUrl: string): void {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[key] = { ...parsed[key], baseURL: newBaseUrl };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch {
        // Ignore
    }
}
