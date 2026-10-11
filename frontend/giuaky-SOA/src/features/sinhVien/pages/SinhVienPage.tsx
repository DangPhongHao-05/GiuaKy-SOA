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
    
    // Đã thay đổi fields theo Backend: maSv, hoTen, email, lop, phone
    const [formData, setFormData] = useState<CreateSinhVienDto>({
        maSv: '',
        hoTen: '',
        email: '',
        lop: '',
        phone: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            maSv: '',
            hoTen: '',
            email: '',
            lop: '',
            phone: '',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: SinhVien) => {
        setEditingItem(item);
        setFormData({
            maSv: item.maSv,
            hoTen: item.hoTen,
            email: item.email || '',
            lop: item.lop || '',
            phone: item.phone || '',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (item: SinhVien) => {
        if (window.confirm(`Xác nhận xóa sinh viên "${item.hoTen}" (${item.maSv})?`)) {
            try {
                // Đã đổi thành truyền id
                await deleteSinhVien(item.id); 
            } catch (err: any) {
                alert(err.message || 'Lỗi khi xóa sinh viên');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Cập nhật điều kiện check
        if (!formData.maSv.trim() || !formData.hoTen.trim()) {
            setFormError('Vui lòng điền đầy đủ Mã SV và Họ tên');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            if (editingItem) {
                // Gọi API với id (số) làm khóa
                await updateSinhVien(editingItem.id, {
                    ...editingItem, // Kế thừa id
                    ...formData,
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

    // Đã đổi cột hiển thị thành Lớp và Điện thoại
    const columns: ColumnDef<SinhVien>[] = [
        {
            header: 'Mã SV',
            key: 'maSv',
            className: 'w-28 font-mono font-bold text-gray-900',
            render: (item) => <span>{item.maSv}</span>,
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
            header: 'Lớp',
            key: 'lop',
            className: 'text-gray-700',
        },
        {
            header: 'Điện thoại',
            key: 'phone',
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
                title="DANH SÁCH SINH VIÊN"
                description="Quản lý bởi SinhVienService (:7005) - Dữ liệu độc lập"
                columns={columns}
                data={sinhViens}
                idKey="id" // QUAN TRỌNG: Đổi idKey thành "id" thay vì "maSV"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchSinhViens}
                searchPlaceholder="Mã SV, họ tên hoặc lớp..."
                searchKeys={['maSv', 'hoTen', 'email', 'lop']} // Đổi search keys
            />

            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `[CẬP NHẬT SINH VIÊN: ${editingItem.maSv}]` : '[THÊM SINH VIÊN MỚI]'}
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
                            value={formData.maSv}
                            onChange={(e) => setFormData({ ...formData, maSv: e.target.value })}
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
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="namtv@qnu.edu.vn"
                            value={formData.email || ""}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Đổi form field thành Lớp */}
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Lớp
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: KTPM46"
                                value={formData.lop || ""}
                                onChange={(e) => setFormData({ ...formData, lop: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                            />
                        </div>

                        {/* Đổi form field thành Điện thoại */}
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                placeholder="090..."
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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