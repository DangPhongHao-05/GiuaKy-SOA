import { dangKyClient } from '../../../services/apiClients';
import type { DangKy, CreateDangKyDto } from '../types';

export const dangKyApi = {
    // 1. GET /api/DangKy - Lấy danh sách đăng ký đề tài từ DangKyService (:7002)
    getAll: async (): Promise<{ data: DangKy[]; isLive: boolean }> => {
        try {
            const res = await dangKyClient.get<DangKy[]>('/DangKy');
            return { data: res.data || [], isLive: true };
        } catch {
            return { data: [], isLive: false };
        }
    },

    // 2. POST /api/DangKy - Tạo mới phiếu đăng ký đề tài từ DangKyService (:7002)
    create: async (dto: CreateDangKyDto): Promise<{ data: DangKy; isLive: boolean }> => {
        const res = await dangKyClient.post<DangKy>('/DangKy', dto);
        return { data: res.data, isLive: true };
    },
};
