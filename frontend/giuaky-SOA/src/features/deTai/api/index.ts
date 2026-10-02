import { deTaiClient } from '../../../services/apiClients';
import { apiLogger } from '../../../services/apiLogger';
import type { DeTai, CreateDeTaiDto, UpdateDeTaiDto } from '../types';

const INITIAL_MOCK_DETAIS: DeTai[] = [
    {
        id: 1,
        tenDeTai: 'Xây dựng hệ thống quản lý đồ án theo kiến trúc Hướng dịch vụ (SOA)',
        moTa: 'Phát triển hệ thống phân tán gồm nhiều Microservice độc lập: SinhVien, DeTai, DangKy, GiangVien và Auth giao tiếp qua HTTP/REST.',
    },
    {
        id: 2,
        tenDeTai: 'Ứng dụng trí tuệ nhân tạo (AI/LLM) trong hỗ trợ chấm điểm đồ án tốt nghiệp',
        moTa: 'Tích hợp mô hình AI phân tích báo cáo đồ án, tự động phát hiện sao chép và đề xuất câu hỏi phản biện.',
    },
    {
        id: 3,
        tenDeTai: 'Nghiên cứu kiến trúc Event-Driven kết hợp Message Broker RabbitMQ trong SOA',
        moTa: 'Tối ưu hóa độ trễ và tính chịu lỗi giữa các dịch vụ trong hệ sinh thái quản lý đào tạo đại học.',
    },
    {
        id: 4,
        tenDeTai: 'Phát triển ứng dụng di động cho sinh viên đăng ký đề tài và theo dõi tiến độ',
        moTa: 'Xây dựng ứng dụng di động Flutter/React Native kết nối các REST API dịch vụ Backend.',
    },
];

const LOCAL_STORAGE_KEY = 'mock_detais_data';

function getLocalMockData(): DeTai[] {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Fallback
    }
    return INITIAL_MOCK_DETAIS;
}

function saveLocalMockData(data: DeTai[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Ignore
    }
}

export const deTaiApi = {
    // 1. Lấy danh sách đề tài (GET /api/DeTai)
    getAll: async (): Promise<{ data: DeTai[]; isLive: boolean }> => {
        try {
            const res = await deTaiClient.get<DeTai[]>('/DeTai');
            return { data: res.data, isLive: true };
        } catch {
            const fallback = getLocalMockData();
            apiLogger.addMockCall({
                serviceName: 'DeTaiService',
                method: 'GET',
                url: 'http://localhost:5003/api/DeTai',
                responseBody: fallback,
                note: 'Không kết nối được cổng 5003 -> Dùng Mock DeTai',
            });
            return { data: fallback, isLive: false };
        }
    },

    // 2. Lấy chi tiết đề tài theo ID (GET /api/DeTai/:id)
    getById: async (id: number): Promise<{ data: DeTai | null; isLive: boolean }> => {
        try {
            const res = await deTaiClient.get<DeTai>(`/DeTai/${id}`);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const found = items.find((d) => d.id === id) || null;
            return { data: found, isLive: false };
        }
    },

    // 3. Thêm mới đề tài (POST /api/DeTai)
    create: async (dto: CreateDeTaiDto): Promise<{ data: DeTai; isLive: boolean }> => {
        try {
            const res = await deTaiClient.post<DeTai>('/DeTai', dto);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const newId = items.length > 0 ? Math.max(...items.map((d) => d.id)) + 1 : 1;
            const newItem: DeTai = { id: newId, tenDeTai: dto.tenDeTai, moTa: dto.moTa };
            items.push(newItem);
            saveLocalMockData(items);

            apiLogger.addMockCall({
                serviceName: 'DeTaiService',
                method: 'POST',
                url: 'http://localhost:5003/api/DeTai',
                requestBody: dto,
                responseBody: newItem,
                note: 'Tạo đề tài trong bộ nhớ Mock cục bộ',
            });
            return { data: newItem, isLive: false };
        }
    },

    // 4. Cập nhật đề tài (PUT /api/DeTai/:id)
    update: async (id: number, dto: UpdateDeTaiDto): Promise<{ data: DeTai; isLive: boolean }> => {
        try {
            const res = await deTaiClient.put(`/DeTai/${id}`, dto);
            const resData = res.data?.data || res.data;
            return { data: resData, isLive: true };
        } catch {
            const items = getLocalMockData();
            const idx = items.findIndex((d) => d.id === id);
            if (idx !== -1) {
                items[idx] = { ...items[idx], ...dto };
                saveLocalMockData(items);
                apiLogger.addMockCall({
                    serviceName: 'DeTaiService',
                    method: 'PUT',
                    url: `http://localhost:5003/api/DeTai/${id}`,
                    requestBody: dto,
                    responseBody: items[idx],
                    note: 'Cập nhật đề tài trong bộ nhớ Mock cục bộ',
                });
                return { data: items[idx], isLive: false };
            }
            throw new Error('Không tìm thấy đề tài để cập nhật');
        }
    },

    // 5. Xóa đề tài (DELETE /api/DeTai/:id)
    delete: async (id: number): Promise<{ success: boolean; isLive: boolean }> => {
        try {
            await deTaiClient.delete(`/DeTai/${id}`);
            return { success: true, isLive: true };
        } catch {
            let items = getLocalMockData();
            items = items.filter((d) => d.id !== id);
            saveLocalMockData(items);
            apiLogger.addMockCall({
                serviceName: 'DeTaiService',
                method: 'DELETE',
                url: `http://localhost:5003/api/DeTai/${id}`,
                responseBody: { message: 'Đã xóa đề tài thành công!' },
                note: 'Xóa đề tài trong bộ nhớ Mock cục bộ',
            });
            return { success: true, isLive: false };
        }
    },
};
