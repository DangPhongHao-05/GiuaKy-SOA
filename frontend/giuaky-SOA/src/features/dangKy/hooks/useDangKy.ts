import { useState, useEffect, useCallback } from 'react';
import { dangKyApi } from '../api';
import { sinhVienApi } from '../../sinhVien/api';
import { deTaiApi } from '../../deTai/api';
import { giangVienApi } from '../../giangVien/api';
import type { DangKy, CreateDangKyDto } from '../types';
import type { SinhVien } from '../../sinhVien/types';
import type { DeTai } from '../../deTai/types';
import type { GiangVien } from '../../giangVien/types';

export function useDangKy() {
    const [dangKys, setDangKys] = useState<DangKy[]>([]);
    const [sinhViens, setSinhViens] = useState<SinhVien[]>([]);
    const [deTais, setDeTais] = useState<DeTai[]>([]);
    const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // SOA Integration: Lấy dữ liệu đồng thời từ 4 microservices độc lập!
            const [dangKyRes, sinhVienRes, deTaiRes, giangVienRes] = await Promise.all([
                dangKyApi.getAll(),
                sinhVienApi.getAll(),
                deTaiApi.getAll(),
                giangVienApi.getAll(),
            ]);

            setDangKys(dangKyRes.data);
            setIsLive(dangKyRes.isLive);
            setSinhViens(sinhVienRes.data);
            setDeTais(deTaiRes.data);
            setGiangViens(giangVienRes.data);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu đăng ký');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const createDangKy = async (dto: CreateDangKyDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await dangKyApi.create(dto);
            setDangKys((prev) => [...prev, res.data]);
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tạo đăng ký');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        dangKys,
        sinhViens,
        deTais,
        giangViens,
        loading,
        isLive,
        error,
        fetchAllData,
        createDangKy,
    };
}
