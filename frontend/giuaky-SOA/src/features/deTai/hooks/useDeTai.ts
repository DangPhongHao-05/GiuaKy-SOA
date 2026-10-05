import { useState, useEffect, useCallback } from 'react';
import { deTaiApi } from '../api';
import type { DeTai, CreateDeTaiDto, UpdateDeTaiDto } from '../types';

export function useDeTai() {
    const [deTais, setDeTais] = useState<DeTai[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDeTais = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await deTaiApi.getAll();
            setDeTais(res.data);
            setIsLive(res.isLive);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải danh sách đề tài');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeTais();
    }, [fetchDeTais]);

    const createDeTai = async (dto: CreateDeTaiDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await deTaiApi.create(dto);
            setDeTais((prev) => [...prev, res.data]);
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tạo đề tài');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDeTai = async (id: number, dto: UpdateDeTaiDto) => {
        setLoading(true);
        setError(null);
        try {
            const res = await deTaiApi.update(id, dto);
            setDeTais((prev) => prev.map((item) => (item.id === id ? res.data : item)));
            setIsLive(res.isLive);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật đề tài');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDeTai = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deTaiApi.delete(id);
            setDeTais((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            setError(err.message || 'Lỗi khi xóa đề tài');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deTais,
        loading,
        isLive,
        error,
        fetchDeTais,
        createDeTai,
        updateDeTai,
        deleteDeTai,
    };
}
