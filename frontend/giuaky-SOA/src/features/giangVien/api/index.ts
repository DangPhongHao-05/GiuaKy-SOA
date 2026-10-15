import { giangVienClient } from '../../../services/apiClients';
import { apiLogger } from '../../../services/apiLogger';
import type { GiangVien, CreateGiangVienDto, UpdateGiangVienDto } from '../types';

const INITIAL_MOCK_GIANGVIENS: GiangVien[] = [
    {
        id: 1,
        maGV: 'GV001',
        hoTen: 'TS. Nguyễn Văn Toàn',
        email: 'toannv@qnu.edu.vn',
        boMon: 'Hệ thống thông tin',
        hocVi: 'Tiến sĩ',
    },
    {
        id: 2,
        maGV: 'GV002',
        hoTen: 'ThS. Trần Thị Mai',
        email: 'maitt@qnu.edu.vn',
        boMon: 'Kỹ thuật phần mềm',
        hocVi: 'Thạc sĩ',
    },
    {
        id: 3,
        maGV: 'GV003',
        hoTen: 'PGS.TS. Lê Đình Minh',
        email: 'minhld@qnu.edu.vn',
        boMon: 'Khoa học máy tính',
        hocVi: 'Phó Giáo sư',
    },
    {
        id: 4,
        maGV: 'GV004',
        hoTen: 'ThS. Phạm Quốc Cường',
        email: 'cuongpq@qnu.edu.vn',
        boMon: 'Mạng máy tính & Viễn thông',
        hocVi: 'Thạc sĩ',
    },
];

const LOCAL_STORAGE_KEY = 'mock_giangviens_data';

function getLocalMockData(): GiangVien[] {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Fallback
    }
    return INITIAL_MOCK_GIANGVIENS;
}

function saveLocalMockData(data: GiangVien[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Ignore
    }
}

export const giangVienApi = {
    // 1. GET /api/GiangVien
    getAll: async (): Promise<{ data: GiangVien[]; isLive: boolean }> => {
        try {
            const res = await giangVienClient.get<GiangVien[]>('/GiangVien');
            return { data: res.data, isLive: true };
        } catch {
            const fallback = getLocalMockData();
            apiLogger.addMockCall({
                serviceName: 'GiangVienService',
                method: 'GET',
                url: 'https://localhost:7004/api/GiangVien',
                responseBody: fallback,
                note: 'GiangVienService (:7004) chưa có logic backend -> Dùng Mock GiangVien',
            });
            return { data: fallback, isLive: false };
        }
    },

    // 2. GET /api/GiangVien/:id
    getById: async (id: number): Promise<{ data: GiangVien | null; isLive: boolean }> => {
        try {
            const res = await giangVienClient.get<GiangVien>(`/GiangVien/${id}`);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const found = items.find((gv) => gv.id === id) || null;
            return { data: found, isLive: false };
        }
    },

    // 3. POST /api/GiangVien
    create: async (dto: CreateGiangVienDto): Promise<{ data: GiangVien; isLive: boolean }> => {
        try {
            const res = await giangVienClient.post<GiangVien>('/GiangVien', dto);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const newId = items.length > 0 ? Math.max(...items.map((g) => g.id)) + 1 : 1;
            const newItem: GiangVien = {
                id: newId,
                maGV: dto.maGV || `GV${String(newId).padStart(3, '0')}`,
                hoTen: dto.hoTen,
                email: dto.email,
                boMon: dto.boMon,
                hocVi: dto.hocVi,
            };
            items.push(newItem);
            saveLocalMockData(items);

            apiLogger.addMockCall({
                serviceName: 'GiangVienService',
                method: 'POST',
                url: 'https://localhost:7004/api/GiangVien',
                requestBody: dto,
                responseBody: newItem,
                note: 'Tạo giảng viên mới trong bộ nhớ Mock cục bộ',
            });
            return { data: newItem, isLive: false };
        }
    },

    // 4. PUT /api/GiangVien/:id
    update: async (id: number, dto: UpdateGiangVienDto): Promise<{ data: GiangVien; isLive: boolean }> => {
        try {
            const res = await giangVienClient.put(`/GiangVien/${id}`, dto);
            const resData = res.data?.data || res.data;
            return { data: resData, isLive: true };
        } catch {
            const items = getLocalMockData();
            const idx = items.findIndex((gv) => gv.id === id);
            if (idx !== -1) {
                items[idx] = { ...items[idx], ...dto };
                saveLocalMockData(items);
                apiLogger.addMockCall({
                    serviceName: 'GiangVienService',
                    method: 'PUT',
                    url: `https://localhost:7004/api/GiangVien/${id}`,
                    requestBody: dto,
                    responseBody: items[idx],
                    note: 'Cập nhật giảng viên trong bộ nhớ Mock cục bộ',
                });
                return { data: items[idx], isLive: false };
            }
            throw new Error('Không tìm thấy giảng viên để cập nhật');
        }
    },

    // 5. DELETE /api/GiangVien/:id
    delete: async (id: number): Promise<{ success: boolean; isLive: boolean }> => {
        try {
            await giangVienClient.delete(`/GiangVien/${id}`);
            return { success: true, isLive: true };
        } catch {
            let items = getLocalMockData();
            items = items.filter((gv) => gv.id !== id);
            saveLocalMockData(items);
            apiLogger.addMockCall({
                serviceName: 'GiangVienService',
                method: 'DELETE',
                url: `https://localhost:7004/api/GiangVien/${id}`,
                responseBody: { message: 'Đã xóa giảng viên' },
                note: 'Xóa giảng viên trong bộ nhớ Mock cục bộ',
            });
            return { success: true, isLive: false };
        }
    },
};
