import { useState, useEffect, useCallback } from 'react';
import { giangVienApi } from '../api';
import type { GiangVien, CreateGiangVienDto, UpdateGiangVienDto } from '../types';

export function useGiangVien() {
    const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGiangViens = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await giangVienApi.getAll();
            setGiangViens(res.data);
            setIsLive(res.isLive);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải danh sách giảng viên');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGiangViens();
    }, [fetchGiangViens]);

    const createGiangVien = async (dto: CreateGiangVienDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await giangVienApi.create(dto);
            setGiangViens((prev) => [...prev, res.data]);
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi thêm giảng viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateGiangVien = async (id: number, dto: UpdateGiangVienDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await giangVienApi.update(id, dto);
            setGiangViens((prev) => prev.map((item) => (item.id === id ? res.data : item)));
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật giảng viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteGiangVien = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await giangVienApi.delete(id);
            setGiangViens((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            setError(err.message || 'Lỗi khi xóa giảng viên');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        giangViens,
        loading,
        isLive,
        error,
        fetchGiangViens,
        createGiangVien,
        updateGiangVien,
        deleteGiangVien,
    };
}
