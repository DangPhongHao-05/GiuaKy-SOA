import { sinhVienClient } from "../../../services/apiClients";
import { apiLogger } from "../../../services/apiLogger";
import type { SinhVien, CreateSinhVienDto, UpdateSinhVienDto } from "../types";

const INITIAL_MOCK_SINHVIENS: SinhVien[] = [
  {
    id: 1,
    maSv: "4451050001",
    hoTen: "Đặng Phong Hào",
    email: "haodp@qnu.edu.vn",
    lop: "KTPM46",
    phone: "0901234567",
  },
  {
    id: 2,
    maSv: "4451050002",
    hoTen: "Tô Hoàng Hào",
    email: "haoth@qnu.edu.vn",
    lop: "KTPM46",
    phone: "0912345678",
  },
  {
    id: 3,
    maSv: "4451050003",
    hoTen: "Bùi Thế Sơn",
    email: "sonbt@qnu.edu.vn",
    lop: "KTPM46",
  },
  {
    id: 4,
    maSv: "4451050004",
    hoTen: "Nguyễn Trần Thiên Bảo",
    email: "bao@qnu.edu.vn",
    lop: "KTPM46",
  },
  {
    id: 5,
    maSv: "4451050005",
    hoTen: "Phạm Hoàng An Khang",
    email: "khang@qnu.edu.vn",
    lop: "KTPM46",
  },
];

const LOCAL_STORAGE_KEY = "mock_sinhviens_data";

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
      const res = await sinhVienClient.get<SinhVien[]>("/SinhVien");
      return { data: res.data, isLive: true };
    } catch {
      const fallback = getLocalMockData();
      apiLogger.addMockCall({
        serviceName: "SinhVienService",
        method: "GET",
        url: "/api/SinhVien",
        responseBody: fallback,
        note: "Dùng Mock SinhVien",
      });
      return { data: fallback, isLive: false };
    }
  },

  // 2. GET /api/SinhVien/{id:int}
  getById: async (
    id: number,
  ): Promise<{ data: SinhVien | null; isLive: boolean }> => {
    try {
      const res = await sinhVienClient.get<SinhVien>(`/SinhVien/${id}`);
      return { data: res.data, isLive: true };
    } catch {
      const items = getLocalMockData();
      const found = items.find((sv) => sv.id === id) || null;
      return { data: found, isLive: false };
    }
  },

  // 3. POST /api/SinhVien
  create: async (
    dto: CreateSinhVienDto,
  ): Promise<{ data: SinhVien; isLive: boolean }> => {
    try {
      const res = await sinhVienClient.post<SinhVien>("/SinhVien", dto);
      return { data: res.data, isLive: true };
    } catch {
      const items = getLocalMockData();
      if (items.some((sv) => sv.maSv === dto.maSv)) {
        throw new Error(`Mã sinh viên ${dto.maSv} đã tồn tại!`);
      }
      // Tạo ID giả cho mock data
      const newId =
        items.length > 0 ? Math.max(...items.map((s) => s.id)) + 1 : 1;
      const newSv: SinhVien = { id: newId, ...dto };

      items.push(newSv);
      saveLocalMockData(items);

      apiLogger.addMockCall({
        serviceName: "SinhVienService",
        method: "POST",
        url: "/api/SinhVien",
        requestBody: dto,
        responseBody: newSv,
        note: "Tạo sinh viên mới trong bộ nhớ Mock",
      });
      return { data: newSv, isLive: false };
    }
  },

  // 4. PUT /api/SinhVien/{id:int}
  update: async (
    id: number,
    dto: UpdateSinhVienDto,
  ): Promise<{ data: SinhVien; isLive: boolean }> => {
    try {
      await sinhVienClient.put(`/SinhVien/${id}`, dto);

      // SỬA Ở ĐÂY: Vì Backend (C#) trả về NoContent (204) nên sẽ không có data.
      // Chúng ta lấy chính dữ liệu dto vừa gửi đi trả về cho React để cập nhật UI ngay lập tức.
      return { data: dto as SinhVien, isLive: true };
    } catch {
      const items = getLocalMockData();
      const idx = items.findIndex((sv) => sv.id === id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...dto, id: id };
        saveLocalMockData(items);
        apiLogger.addMockCall({
          serviceName: "SinhVienService",
          method: "PUT",
          url: `/api/SinhVien/${id}`,
          requestBody: dto,
          responseBody: items[idx],
          note: "Cập nhật sinh viên trong bộ nhớ Mock",
        });
        return { data: items[idx], isLive: false };
      }
      throw new Error("Không tìm thấy sinh viên để cập nhật");
    }
  },

  // 5. DELETE /api/SinhVien/{id:int}
  delete: async (
    id: number,
  ): Promise<{ success: boolean; isLive: boolean }> => {
    try {
      await sinhVienClient.delete(`/SinhVien/${id}`);
      return { success: true, isLive: true };
    } catch {
      let items = getLocalMockData();
      items = items.filter((sv) => sv.id !== id);
      saveLocalMockData(items);
      apiLogger.addMockCall({
        serviceName: "SinhVienService",
        method: "DELETE",
        url: `/api/SinhVien/${id}`,
        responseBody: { message: "Đã xóa sinh viên" },
        note: "Xóa sinh viên trong bộ nhớ Mock",
      });
      return { success: true, isLive: false };
    }
  },
};
