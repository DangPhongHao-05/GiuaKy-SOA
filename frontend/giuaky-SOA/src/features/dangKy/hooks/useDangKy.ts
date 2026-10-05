import { useState, useEffect, useCallback } from 'react';
import { dangKyApi } from '../api';
import { sinhVienApi } from '../../sinhVien/api';
import { deTaiApi } from '../../deTai/api';
import type { DangKy, CreateDangKyDto, UpdateDangKyDto } from '../types';
import type { SinhVien } from '../../sinhVien/types';
import type { DeTai } from '../../deTai/types';

export function useDangKy() {
    const [dangKys, setDangKys] = useState<DangKy[]>([]);
    const [sinhViens, setSinhViens] = useState<SinhVien[]>([]);
    const [deTais, setDeTais] = useState<DeTai[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // SOA Integration: Fetch data concurrently from 3 independent microservices!
            const [dangKyRes, sinhVienRes, deTaiRes] = await Promise.all([
                dangKyApi.getAll(),
                sinhVienApi.getAll(),
                deTaiApi.getAll(),
            ]);

            setDangKys(dangKyRes.data);
            setIsLive(dangKyRes.isLive);
            setSinhViens(sinhVienRes.data);
            setDeTais(deTaiRes.data);
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

    const updateDangKy = async (id: number, dto: UpdateDangKyDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await dangKyApi.update(id, dto);
            setDangKys((prev) => prev.map((item) => (item.id === id ? res.data : item)));
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật đăng ký');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDangKy = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await dangKyApi.delete(id);
            setDangKys((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            setError(err.message || 'Lỗi khi hủy đăng ký');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        dangKys,
        sinhViens,
        deTais,
        loading,
        isLive,
        error,
        fetchAllData,
        createDangKy,
        updateDangKy,
        deleteDangKy,
    };
}
