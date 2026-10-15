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
        setFormData({
            maGV: item.maGV || '',
            hoTen: item.hoTen,
            email: item.email,
            boMon: item.boMon,
            hocVi: item.hocVi,
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (item: GiangVien) => {
        if (window.confirm(`Xác nhận xóa giảng viên "${item.hoTen}" (#${item.id})?`)) {
            try {
                await deleteGiangVien(item.id);
            } catch (err: any) {
                alert(err.message || 'Lỗi khi xóa giảng viên');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.hoTen.trim() || !formData.email.trim()) {
            setFormError('Vui lòng điền đầy đủ Họ tên và Email');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            if (editingItem) {
                await updateGiangVien(editingItem.id, {
                    maGV: formData.maGV,
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
            header: 'ID',
            key: 'id',
            className: 'w-16 font-mono font-bold text-gray-700',
            render: (item) => <span>#{item.id}</span>,
        },
        {
            header: 'Mã GV',
            key: 'maGV',
            className: 'w-24 font-mono font-bold text-gray-900',
            render: (item) => <span>{item.maGV || '-'}</span>,
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
                idKey="id"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchGiangViens}
                searchPlaceholder="Mã GV, họ tên hoặc bộ môn..."
                searchKeys={['id', 'maGV', 'hoTen', 'email', 'boMon']}
            />

            {/* Modal Wireframe */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `[CẬP NHẬT GIẢNG VIÊN: #${editingItem.id} - ${editingItem.hoTen}]` : '[THÊM GIẢNG VIÊN MỚI]'}
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
                            Mã giảng viên
                        </label>
                        <input
                            type="text"
                            placeholder="Ví dụ: GV012 (để trống hệ thống sẽ tự sinh)"
                            value={formData.maGV || ''}
                            onChange={(e) => setFormData({ ...formData, maGV: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
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
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Email công vụ *
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
                            <select
                                value={formData.boMon || ''}
                                onChange={(e) => setFormData({ ...formData, boMon: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                            >
                                <option value="Hệ thống thông tin">Hệ thống thông tin</option>
                                <option value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</option>
                                <option value="Khoa học máy tính">Khoa học máy tính</option>
                                <option value="Mạng máy tính & Viễn thông">Mạng & Viễn thông</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Học vị
                            </label>
                            <select
                                value={formData.hocVi || ''}
                                onChange={(e) => setFormData({ ...formData, hocVi: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                            >
                                <option value="Cử nhân">Cử nhân</option>
                                <option value="Thạc sĩ">Thạc sĩ</option>
                                <option value="Tiến sĩ">Tiến sĩ</option>
                                <option value="Phó Giáo sư">Phó Giáo sư</option>
                                <option value="Giáo sư">Giáo sư</option>
                            </select>
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
                            {submitting ? '[Đang lưu...]' : editingItem ? '[Cập nhật]' : '[Thêm mới]'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
