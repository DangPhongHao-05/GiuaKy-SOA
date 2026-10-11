export interface SinhVien {
  id: number;
  maSv: string;
  hoTen: string;
  ngaySinh?: string | null;
  lop?: string | null;
  email?: string | null;
  phone?: string | null;
}

// Khi tạo mới không cần truyền id
export type CreateSinhVienDto = Omit<SinhVien, "id">;
export type UpdateSinhVienDto = SinhVien;
