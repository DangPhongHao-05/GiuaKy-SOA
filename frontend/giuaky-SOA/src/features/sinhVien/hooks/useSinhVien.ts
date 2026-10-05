import { useState, useEffect, useCallback } from 'react';
import { sinhVienApi } from '../api';
import type { SinhVien, CreateSinhVienDto, UpdateSinhVienDto } from '../types';

export function useSinhVien() {
    const [sinhViens, setSinhViens] = useState<SinhVien[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSinhViens = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await sinhVienApi.getAll();
            setSinhViens(res.data);
            setIsLive(res.isLive);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải danh sách sinh viên');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSinhViens();
    }, [fetchSinhViens]);

    const createSinhVien = async (dto: CreateSinhVienDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await sinhVienApi.create(dto);
            setSinhViens((prev) => [...prev, res.data]);
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi thêm sinh viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateSinhVien = async (maSV: string, dto: UpdateSinhVienDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await sinhVienApi.update(maSV, dto);
            setSinhViens((prev) => prev.map((item) => (item.maSV === maSV ? res.data : item)));
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật sinh viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteSinhVien = async (maSV: string) => {
        setLoading(true);
        setError(null);
        try {
            await sinhVienApi.delete(maSV);
            setSinhViens((prev) => prev.filter((item) => item.maSV !== maSV));
        } catch (err: any) {
            setError(err.message || 'Lỗi khi xóa sinh viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        sinhViens,
        loading,
        isLive,
        error,
        fetchSinhViens,
        createSinhVien,
        updateSinhVien,
        deleteSinhVien,
    };
}
