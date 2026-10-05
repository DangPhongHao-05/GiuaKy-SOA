import { sinhVienClient } from '../../../services/apiClients';
import { apiLogger } from '../../../services/apiLogger';
import type { SinhVien, CreateSinhVienDto, UpdateSinhVienDto } from '../types';

const INITIAL_MOCK_SINHVIENS: SinhVien[] = [
    {
        maSV: '4451050001',
        hoTen: 'Đặng Phong Hào',
        email: 'haodp@qnu.edu.vn',
        khoa: 'Công nghệ thông tin',
        nienKhoa: '2021 - 2025',
    },
    {
        maSV: '4451050002',
        hoTen: 'Tô Hoàng Hào',
        email: 'haoth@qnu.edu.vn',
        khoa: 'Công nghệ thông tin',
        nienKhoa: '2021 - 2025',
    },
    {
        maSV: '4451050003',
        hoTen: 'Bùi Thế Sơn',
        email: 'sonbt@qnu.edu.vn',
        khoa: 'Kỹ thuật phần mềm',
        nienKhoa: '2021 - 2025',
    },
    {
        maSV: '4451050004',
        hoTen: 'Phạm Hoàng An Khang',
        email: 'khangpha@qnu.edu.vn',
        khoa: 'Hệ thống thông tin',
        nienKhoa: '2021 - 2025',
    },
    {
        maSV: '4451050005',
        hoTen: 'Nguyễn Trần Thiên Bảo',
        email: 'baontt@qnu.edu.vn',
        khoa: 'Khoa học máy tính',
        nienKhoa: '2021 - 2025',
    },
];

const LOCAL_STORAGE_KEY = 'mock_sinhviens_data';

function getLocalMockData(): SinhVien[] {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Fallback
    }
    return INITIAL_MOCK_SINHVIENS;
}

function saveLocalMockData(data: SinhVien[]) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Ignore
    }
}

export const sinhVienApi = {
    // 1. GET /api/SinhVien
    getAll: async (): Promise<{ data: SinhVien[]; isLive: boolean }> => {
        try {
            const res = await sinhVienClient.get<SinhVien[]>('/SinhVien');
            return { data: res.data, isLive: true };
        } catch {
            const fallback = getLocalMockData();
            apiLogger.addMockCall({
                serviceName: 'SinhVienService',
                method: 'GET',
                url: 'https://localhost:7005/api/SinhVien',
                responseBody: fallback,
                note: 'SinhVienService (:7005) chưa có logic backend -> Dùng Mock SinhVien',
            });
            return { data: fallback, isLive: false };
        }
    },

    // 2. GET /api/SinhVien/:maSV
    getById: async (maSV: string): Promise<{ data: SinhVien | null; isLive: boolean }> => {
        try {
            const res = await sinhVienClient.get<SinhVien>(`/SinhVien/${maSV}`);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            const found = items.find((sv) => sv.maSV === maSV) || null;
            return { data: found, isLive: false };
        }
    },

    // 3. POST /api/SinhVien
    create: async (dto: CreateSinhVienDto): Promise<{ data: SinhVien; isLive: boolean }> => {
        try {
            const res = await sinhVienClient.post<SinhVien>('/SinhVien', dto);
            return { data: res.data, isLive: true };
        } catch {
            const items = getLocalMockData();
            if (items.some((sv) => sv.maSV === dto.maSV)) {
                throw new Error(`Mã sinh viên ${dto.maSV} đã tồn tại!`);
            }
            items.push(dto);
            saveLocalMockData(items);

            apiLogger.addMockCall({
                serviceName: 'SinhVienService',
                method: 'POST',
                url: 'https://localhost:7005/api/SinhVien',
                requestBody: dto,
                responseBody: dto,
                note: 'Tạo sinh viên mới trong bộ nhớ Mock cục bộ',
            });
            return { data: dto, isLive: false };
        }
    },

    // 4. PUT /api/SinhVien/:maSV
    update: async (maSV: string, dto: UpdateSinhVienDto): Promise<{ data: SinhVien; isLive: boolean }> => {
        try {
            const res = await sinhVienClient.put(`/SinhVien/${maSV}`, dto);
            const resData = res.data?.data || res.data;
            return { data: resData, isLive: true };
        } catch {
            const items = getLocalMockData();
            const idx = items.findIndex((sv) => sv.maSV === maSV);
            if (idx !== -1) {
                items[idx] = { ...items[idx], ...dto };
                saveLocalMockData(items);
                apiLogger.addMockCall({
                    serviceName: 'SinhVienService',
                    method: 'PUT',
                    url: `https://localhost:7005/api/SinhVien/${maSV}`,
                    requestBody: dto,
                    responseBody: items[idx],
                    note: 'Cập nhật sinh viên trong bộ nhớ Mock cục bộ',
                });
                return { data: items[idx], isLive: false };
            }
            throw new Error('Không tìm thấy sinh viên để cập nhật');
        }
    },

    // 5. DELETE /api/SinhVien/:maSV
    delete: async (maSV: string): Promise<{ success: boolean; isLive: boolean }> => {
        try {
            await sinhVienClient.delete(`/SinhVien/${maSV}`);
            return { success: true, isLive: true };
        } catch {
            let items = getLocalMockData();
            items = items.filter((sv) => sv.maSV !== maSV);
            saveLocalMockData(items);
            apiLogger.addMockCall({
                serviceName: 'SinhVienService',
                method: 'DELETE',
                url: `https://localhost:7005/api/SinhVien/${maSV}`,
                responseBody: { message: 'Đã xóa sinh viên' },
                note: 'Xóa sinh viên trong bộ nhớ Mock cục bộ',
            });
            return { success: true, isLive: false };
        }
    },
};
