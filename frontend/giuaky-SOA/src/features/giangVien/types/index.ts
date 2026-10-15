export interface GiangVien {
    id: number;
    maGV?: string;
    hoTen: string;
    email: string;
    boMon: string;
    hocVi: string;
}

export type CreateGiangVienDto = Omit<GiangVien, 'id'> & { id?: number };
export type UpdateGiangVienDto = Partial<Omit<GiangVien, 'id'>>;
