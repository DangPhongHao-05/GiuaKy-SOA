export interface SinhVien {
    maSV: string;
    hoTen: string;
    email: string;
    khoa: string;
    nienKhoa: string;
}

export type CreateSinhVienDto = SinhVien;
export type UpdateSinhVienDto = Partial<Omit<SinhVien, 'maSV'>>;
