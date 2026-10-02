import { dangKyClient } from '../../../services/apiClients';
import { apiLogger } from '../../../services/apiLogger';
import type { DangKy, CreateDangKyDto, UpdateDangKyDto } from '../types';

const INITIAL_MOCK_DANGKYS: DangKy[] = [
    {
        id: 1,
        maSV: '4451050001',
        maDeTai: 1,
        ngayDangKy: '2026-09-15',
        trangThai: 'Đã duyệt',
        ghiChu: 'Sinh viên đạt điểm tích lũy > 3.2, đủ điều kiện làm đồ án',
    },
    {
        id: 2,
        maSV: '4451050002',
        maDeTai: 2,
        ngayDangKy: '2026-09-18',
        trangThai: 'Chờ duyệt',
        ghiChu: 'Chờ cán bộ hướng dẫn phân công hội đồng',
    },
    {
        id: 3,
        maSV: '4451050003',
        maDeTai: 3,
        ngayDangKy: '2026-09-20',
        trangThai: 'Đã duyệt',
        ghiChu: 'Đã bảo vệ đề cương sơ bộ thành công',
    },
    {
        id: 4,
        maSV: '4451050004',
        maDeTai: 4,
        ngayDangKy: '2026-09-22',
        trangThai: 'Chờ duyệt',
        ghiChu: 'Đăng ký nguyện vọng 1',
    },
];

const LOCAL_STORAGE_KEY = 'mock_dangkys_data';

function getLocalMockData(): DangKy[] {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Fallback
    }
    return INITIAL_MOCK_DANGKYS;
}

function saveLocalMockData(data: DangKy[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Ignore
    }
}

export const dangKyApi = {
    // 1. GET /api/DangKy
    getAll: async (): Promise<{ data: DangKy[]; isLive: boolean }> => {
        try {
            const res = await dangKyClient.get<DangKy[]>('/DangKy');
            return { data: res.data, isLive: true };
        } catch {
            const fallback = getLocalMockData();
            apiLogger.addMockCall({
                serviceName: 'DangKyService',
                method: 'GET',
                url: 'http://localhost:5002/api/DangKy',
                responseBody: fallback,
                note: 'DangKyService (:5002) chưa có logic backend -> Dùng Mock DangKy',
            });
            return { data: fallback, isLive: false };
        }
    },

    // 2. GET /api/DangKy/:id
    getById: async (id: number): Promise<{ data: DangKy | null; isLive: boolean }> => {
        try {
            const res = await dangKyClient.get<DangKy>(`/DangKy/${id}`);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const found = items.find((dk) => dk.id === id) || null;
            return { data: found, isLive: false };
        }
    },

    // 3. POST /api/DangKy
    create: async (dto: CreateDangKyDto): Promise<{ data: DangKy; isLive: boolean }> => {
        try {
            const res = await dangKyClient.post<DangKy>('/DangKy', dto);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const newId = items.length > 0 ? Math.max(...items.map((dk) => dk.id)) + 1 : 1;
            const newItem: DangKy = {
                id: newId,
                maSV: dto.maSV,
                maDeTai: Number(dto.maDeTai),
                ngayDangKy: dto.ngayDangKy || new Date().toISOString().split('T')[0],
                trangThai: dto.trangThai || 'Chờ duyệt',
                ghiChu: dto.ghiChu,
            };
            items.push(newItem);
            saveLocalMockData(items);

            apiLogger.addMockCall({
                serviceName: 'DangKyService',
                method: 'POST',
                url: 'http://localhost:5002/api/DangKy',
                requestBody: dto,
                responseBody: newItem,
                note: 'Tạo phiếu đăng ký đề tài trong bộ nhớ Mock cục bộ',
            });
            return { data: newItem, isLive: false };
        }
    },

    // 4. PUT /api/DangKy/:id
    update: async (id: number, dto: UpdateDangKyDto): Promise<{ data: DangKy; isLive: boolean }> => {
        try {
            const res = await dangKyClient.put(`/DangKy/${id}`, dto);
            const resData = res.data?.data || res.data;
            return { data: resData, isLive: true };
        } catch {
            const items = getLocalMockData();
            const idx = items.findIndex((dk) => dk.id === id);
            if (idx !== -1) {
                items[idx] = {
                    ...items[idx],
                    ...dto,
                    maDeTai: dto.maDeTai ? Number(dto.maDeTai) : items[idx].maDeTai,
                };
                saveLocalMockData(items);
                apiLogger.addMockCall({
                    serviceName: 'DangKyService',
                    method: 'PUT',
                    url: `http://localhost:5002/api/DangKy/${id}`,
                    requestBody: dto,
                    responseBody: items[idx],
                    note: 'Cập nhật phiếu đăng ký trong bộ nhớ Mock cục bộ',
                });
                return { data: items[idx], isLive: false };
            }
            throw new Error('Không tìm thấy bản ghi đăng ký để cập nhật');
        }
    },

    // 5. DELETE /api/DangKy/:id
    delete: async (id: number): Promise<{ success: boolean; isLive: boolean }> => {
        try {
            await dangKyClient.delete(`/DangKy/${id}`);
            return { success: true, isLive: true };
        } catch {
            let items = getLocalMockData();
            items = items.filter((dk) => dk.id !== id);
            saveLocalMockData(items);
            apiLogger.addMockCall({
                serviceName: 'DangKyService',
                method: 'DELETE',
                url: `http://localhost:5002/api/DangKy/${id}`,
                responseBody: { message: 'Đã hủy đơn đăng ký' },
                note: 'Xóa phiếu đăng ký trong bộ nhớ Mock cục bộ',
            });
            return { success: true, isLive: false };
        }
    },
};
