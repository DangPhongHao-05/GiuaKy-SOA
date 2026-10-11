export interface GiangVien {
    id?: string;
    maGV: string;
    hoTen: string;
    email: string;
    boMon: string;
    hocVi: string;
}

export type CreateGiangVienDto = GiangVien;
export type UpdateGiangVienDto = Partial<Omit<GiangVien, 'maGV'>>;
