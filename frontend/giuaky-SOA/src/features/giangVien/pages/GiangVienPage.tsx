import React, { useState } from 'react';
import { useGiangVien } from '../hooks/useGiangVien';
import { ServiceBadge } from '../../../components/shared/ServiceBadge';
import { DataTable, type ColumnDef } from '../../../components/shared/DataTable';
import { Modal } from '../../../components/shared/Modal';
import type { GiangVien, CreateGiangVienDto } from '../types';

export const GiangVienPage: React.FC = () => {
    const { giangViens, loading, isLive, error, fetchGiangViens, createGiangVien, updateGiangVien, deleteGiangVien } =
        useGiangVien();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GiangVien | null>(null);
    const [formData, setFormData] = useState<CreateGiangVienDto>({
        maGV: '',
        hoTen: '',
        email: '',
        boMon: 'Hệ thống thông tin',
        hocVi: 'Thạc sĩ',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            maGV: '',
            hoTen: '',
            email: '',
            boMon: 'Hệ thống thông tin',
            hocVi: 'Thạc sĩ',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: GiangVien) => {
        setEditingItem(item);
        setFormData(item);
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (item: GiangVien) => {
        if (window.confirm(`Xác nhận xóa giảng viên "${item.hoTen}" (${item.maGV})?`)) {
            try {
                await deleteGiangVien(item.maGV);
            } catch (err: any) {
                alert(err.message || 'Lỗi khi xóa giảng viên');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.maGV.trim() || !formData.hoTen.trim() || !formData.email.trim()) {
            setFormError('Vui lòng điền đầy đủ Mã GV, Họ tên và Email');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            if (editingItem) {
                await updateGiangVien(editingItem.maGV, {
                    hoTen: formData.hoTen,
                    email: formData.email,
                    boMon: formData.boMon,
                    hocVi: formData.hocVi,
                });
            } else {
                await createGiangVien(formData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setFormError(err.message || 'Có lỗi xảy ra khi lưu giảng viên');
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnDef<GiangVien>[] = [
        {
            header: 'Mã GV',
            key: 'maGV',
            className: 'w-24 font-mono font-bold text-gray-900',
            render: (item) => <span>{item.maGV}</span>,
        },
        {
            header: 'Họ tên Giảng viên',
            key: 'hoTen',
            className: 'font-semibold text-gray-900',
            render: (item) => (
                <div>
                    <span className="font-semibold text-gray-900">{item.hoTen}</span>
                    <span className="block text-[11px] text-gray-500 font-mono">{item.email}</span>
                </div>
            ),
        },
        {
            header: 'Bộ môn',
            key: 'boMon',
            className: 'text-gray-700',
        },
        {
            header: 'Học vị',
            key: 'hocVi',
            className: 'text-gray-600 font-mono w-28',
        },
    ];

    return (
        <div className="space-y-3">
            <ServiceBadge serviceKey="giangVien" isLive={isLive} onRefresh={fetchGiangViens} />

            {error && (
                <div className="p-2 border border-rose-400 bg-rose-50 text-rose-800 text-xs font-mono flex items-center justify-between">
                    <span>[LỖI]: {error}</span>
                    <button
                        type="button"
                        onClick={fetchGiangViens}
                        className="px-2 py-0.5 border border-rose-300 bg-white hover:bg-rose-100 text-rose-800 cursor-pointer"
                    >
                        [Thử lại]
                    </button>
                </div>
            )}

            <DataTable<GiangVien>
                title="HỘI ĐỒNG GIẢNG VIÊN HƯỚNG DẪN"
                description="Quản lý bởi GiangVienService (:7004) - Dữ liệu độc lập"
                columns={columns}
                data={giangViens}
                idKey="maGV"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchGiangViens}
                searchPlaceholder="Mã GV, họ tên hoặc bộ môn..."
                searchKeys={['maGV', 'hoTen', 'email', 'boMon']}
            />

            {/* Modal Wireframe */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `[CẬP NHẬT GIẢNG VIÊN: ${editingItem.maGV}]` : '[THÊM GIẢNG VIÊN MỚI]'}
                onClose={() => setIsModalOpen(false)}
            >
                <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
                    {formError && (
                        <div className="p-2 border border-rose-300 bg-rose-50 text-rose-700 text-xs">
                            [LỖI]: {formError}
                        </div>
                    )}

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Mã giảng viên *
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingItem}
                            placeholder="Ví dụ: GV012"
                            value={formData.maGV}
                            onChange={(e) => setFormData({ ...formData, maGV: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Họ và tên giảng viên *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: TS. Nguyễn Văn A"
                            value={formData.hoTen}
                            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Email liên lạc *
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="anv@qnu.edu.vn"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Bộ môn
                            </label>
                            <input
                                type="text"
                                value={formData.boMon}
                                onChange={(e) => setFormData({ ...formData, boMon: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Học vị / Học hàm
                            </label>
                            <input
                                type="text"
                                value={formData.hocVi}
                                onChange={(e) => setFormData({ ...formData, hocVi: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs cursor-pointer"
                        >
                            [Hủy bỏ]
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-3 py-1.5 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                        >
                            {submitting ? '[Đang lưu...]' : editingItem ? '[Lưu thay đổi]' : '[Thêm giảng viên]'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
