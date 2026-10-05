export interface DeTai {
    id: number;
    tenDeTai: string;
    moTa?: string | null;
}

export interface CreateDeTaiDto {
    tenDeTai: string;
    moTa?: string | null;
}

export interface UpdateDeTaiDto {
    tenDeTai: string;
    moTa?: string | null;
}
