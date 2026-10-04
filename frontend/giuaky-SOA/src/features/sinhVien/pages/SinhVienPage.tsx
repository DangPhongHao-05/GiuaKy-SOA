import React, { useState } from 'react';
import { useSinhVien } from '../hooks/useSinhVien';
import { ServiceBadge } from '../../../components/shared/ServiceBadge';
import { DataTable, type ColumnDef } from '../../../components/shared/DataTable';
import { Modal } from '../../../components/shared/Modal';
import type { SinhVien, CreateSinhVienDto } from '../types';

export const SinhVienPage: React.FC = () => {
    const { sinhViens, loading, isLive, error, fetchSinhViens, createSinhVien, updateSinhVien, deleteSinhVien } =
        useSinhVien();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SinhVien | null>(null);
    const [formData, setFormData] = useState<CreateSinhVienDto>({
        maSV: '',
        hoTen: '',
        email: '',
        khoa: 'Công nghệ thông tin',
        nienKhoa: '2021 - 2025',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            maSV: '',
            hoTen: '',
            email: '',
            khoa: 'Công nghệ thông tin',
            nienKhoa: '2021 - 2025',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: SinhVien) => {
        setEditingItem(item);
        setFormData(item);
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (item: SinhVien) => {
        if (window.confirm(`Xác nhận xóa sinh viên "${item.hoTen}" (${item.maSV})?`)) {
            try {
                await deleteSinhVien(item.maSV);
            } catch (err: any) {
                alert(err.message || 'Lỗi khi xóa sinh viên');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.maSV.trim() || !formData.hoTen.trim() || !formData.email.trim()) {
            setFormError('Vui lòng điền đầy đủ Mã SV, Họ tên và Email');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            if (editingItem) {
                await updateSinhVien(editingItem.maSV, {
                    hoTen: formData.hoTen,
                    email: formData.email,
                    khoa: formData.khoa,
                    nienKhoa: formData.nienKhoa,
                });
            } else {
                await createSinhVien(formData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setFormError(err.message || 'Có lỗi xảy ra khi lưu sinh viên');
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnDef<SinhVien>[] = [
        {
            header: 'Mã SV',
            key: 'maSV',
            className: 'w-28 font-mono font-bold text-gray-900',
            render: (item) => <span>{item.maSV}</span>,
        },
        {
            header: 'Họ và tên',
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
            header: 'Khoa đào tạo',
            key: 'khoa',
            className: 'text-gray-700',
        },
        {
            header: 'Niên khóa',
            key: 'nienKhoa',
            className: 'text-xs text-gray-600 font-mono w-32',
        },
    ];

    return (
        <div className="space-y-3">
            <ServiceBadge serviceKey="sinhVien" isLive={isLive} onRefresh={fetchSinhViens} />

            {error && (
                <div className="p-2 border border-rose-400 bg-rose-50 text-rose-800 text-xs font-mono flex items-center justify-between">
                    <span>[LỖI]: {error}</span>
                    <button
                        type="button"
                        onClick={fetchSinhViens}
                        className="px-2 py-0.5 border border-rose-300 bg-white hover:bg-rose-100 text-rose-800 cursor-pointer"
                    >
                        [Thử lại]
                    </button>
                </div>
            )}

            <DataTable<SinhVien>
                title="DANH SÁCH SINH VIÊN TỐT NGHIỆP"
                description="Quản lý bởi SinhVienService (:7005) - Dữ liệu độc lập"
                columns={columns}
                data={sinhViens}
                idKey="maSV"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchSinhViens}
                searchPlaceholder="Mã SV, họ tên hoặc khoa..."
                searchKeys={['maSV', 'hoTen', 'email', 'khoa']}
            />

            {/* Modal Wireframe */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `[CẬP NHẬT SINH VIÊN: ${editingItem.maSV}]` : '[THÊM SINH VIÊN MỚI]'}
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
                            Mã sinh viên *
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingItem}
                            placeholder="Ví dụ: 4451050099"
                            value={formData.maSV}
                            onChange={(e) => setFormData({ ...formData, maSV: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Họ và tên *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: Trần Văn Nam"
                            value={formData.hoTen}
                            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Email trường cấp *
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="namtv@qnu.edu.vn"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Khoa đào tạo
                            </label>
                            <input
                                type="text"
                                value={formData.khoa}
                                onChange={(e) => setFormData({ ...formData, khoa: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Niên khóa
                            </label>
                            <input
                                type="text"
                                value={formData.nienKhoa}
                                onChange={(e) => setFormData({ ...formData, nienKhoa: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
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
                            {submitting ? '[Đang lưu...]' : editingItem ? '[Lưu thay đổi]' : '[Thêm sinh viên]'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
