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
        if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${item.hoTen}" (${item.maSV})?`)) {
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
            className: 'w-32',
            render: (item) => (
                <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                    {item.maSV}
                </span>
            ),
        },
        {
            header: 'Họ và tên',
            key: 'hoTen',
            className: 'font-semibold text-gray-900',
            render: (item) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        {item.hoTen.split(' ').pop()?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-xs">{item.hoTen}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{item.email}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Khoa / Viện',
            key: 'khoa',
            render: (item) => (
                <span className="text-xs text-gray-700 font-medium px-2 py-0.5 bg-gray-100 rounded">
                    {item.khoa}
                </span>
            ),
        },
        {
            header: 'Niên khóa',
            key: 'nienKhoa',
            className: 'text-xs text-gray-500 font-mono',
        },
    ];

    return (
        <div className="space-y-6">
            <ServiceBadge serviceKey="sinhVien" isLive={isLive} />

            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchSinhViens} className="underline font-bold">Thử lại</button>
                </div>
            )}

            <DataTable<SinhVien>
                title="Danh sách Sinh viên tốt nghiệp"
                description="Dữ liệu do SinhVienService (:5005) phụ trách quản trị độc lập"
                columns={columns}
                data={sinhViens}
                idKey="maSV"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchSinhViens}
                searchPlaceholder="Tìm theo Mã SV, họ tên hoặc khoa..."
                searchKeys={['maSV', 'hoTen', 'email', 'khoa']}
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `Chỉnh sửa sinh viên: ${editingItem.maSV}` : 'Thêm mới sinh viên'}
                onClose={() => setIsModalOpen(false)}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formError && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-200">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mã sinh viên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingItem}
                            placeholder="Ví dụ: 4451050099"
                            value={formData.maSV}
                            onChange={(e) => setFormData({ ...formData, maSV: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: Trần Văn Nam"
                            value={formData.hoTen}
                            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email trường cấp <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="namtv@qnu.edu.vn"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Khoa đào tạo
                            </label>
                            <input
                                type="text"
                                value={formData.khoa}
                                onChange={(e) => setFormData({ ...formData, khoa: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Niên khóa
                            </label>
                            <input
                                type="text"
                                value={formData.nienKhoa}
                                onChange={(e) => setFormData({ ...formData, nienKhoa: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 shadow-xs"
                        >
                            {submitting ? 'Đang lưu...' : editingItem ? 'Lưu thay đổi' : 'Thêm sinh viên'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
