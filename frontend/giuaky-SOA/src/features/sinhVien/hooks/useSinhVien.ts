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

    // Sửa nhận vào tham số id (number)
    const updateSinhVien = async (id: number, dto: UpdateSinhVienDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await sinhVienApi.update(id, dto);
            // Cập nhật lại list theo id
            setSinhViens((prev) => prev.map((item) => (item.id === id ? res.data : item)));
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật sinh viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sửa nhận vào tham số id (number)
    const deleteSinhVien = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await sinhVienApi.delete(id);
            // Lọc ra list mới theo id
            setSinhViens((prev) => prev.filter((item) => item.id !== id));
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