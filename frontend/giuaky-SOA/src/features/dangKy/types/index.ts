export type TrangThaiDangKy = 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';

export interface DangKy {
    id: number;
    maSV: string;
    maDeTai: number;
    ngayDangKy: string;
    trangThai: TrangThaiDangKy;
    ghiChu?: string;
}

export interface CreateDangKyDto {
    maSV: string;
    maDeTai: number;
    ngayDangKy?: string;
    trangThai?: TrangThaiDangKy;
    ghiChu?: string;
}

export interface UpdateDangKyDto {
    maSV?: string;
    maDeTai?: number;
    trangThai?: TrangThaiDangKy;
    ghiChu?: string;
}
