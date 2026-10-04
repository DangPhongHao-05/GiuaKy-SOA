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
        if (window.confirm(`Bạn có chắc chắn muốn xóa giảng viên "${item.hoTen}" (${item.maGV})?`)) {
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
            className: 'w-28',
            render: (item) => (
                <span className="font-mono font-bold text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-200">
                    {item.maGV}
                </span>
            ),
        },
        {
            header: 'Họ tên Giảng viên',
            key: 'hoTen',
            className: 'font-semibold text-gray-900',
            render: (item) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                        {item.hoTen.split(' ').pop()?.charAt(0) || 'G'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-xs">{item.hoTen}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{item.email}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Bộ môn',
            key: 'boMon',
            render: (item) => (
                <span className="text-xs text-gray-700 font-medium px-2 py-0.5 bg-gray-100 rounded">
                    {item.boMon}
                </span>
            ),
        },
        {
            header: 'Học vị',
            key: 'hocVi',
            render: (item) => (
                <span className="text-xs text-purple-700 font-semibold px-2 py-0.5 bg-purple-50 rounded border border-purple-100">
                    {item.hocVi}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <ServiceBadge serviceKey="giangVien" isLive={isLive} />

            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchGiangViens} className="underline font-bold">Thử lại</button>
                </div>
            )}

            <DataTable<GiangVien>
                title="Hội đồng & Giảng viên Hướng dẫn"
                description="Dữ liệu do GiangVienService (:7004) quản lý độc lập"
                columns={columns}
                data={giangViens}
                idKey="maGV"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchGiangViens}
                searchPlaceholder="Tìm theo Mã GV, họ tên hoặc bộ môn..."
                searchKeys={['maGV', 'hoTen', 'email', 'boMon', 'hocVi']}
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `Chỉnh sửa giảng viên: ${editingItem.maGV}` : 'Thêm mới giảng viên'}
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
                            Mã giảng viên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            disabled={!!editingItem}
                            placeholder="Ví dụ: GV099"
                            value={formData.maGV}
                            onChange={(e) => setFormData({ ...formData, maGV: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: PGS.TS. Nguyễn Văn A"
                            value={formData.hoTen}
                            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email cơ quan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="gv@qnu.edu.vn"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Bộ môn
                            </label>
                            <input
                                type="text"
                                value={formData.boMon}
                                onChange={(e) => setFormData({ ...formData, boMon: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Học vị
                            </label>
                            <select
                                value={formData.hocVi}
                                onChange={(e) => setFormData({ ...formData, hocVi: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition"
                            >
                                <option value="Cử nhân / Kỹ sư">Cử nhân / Kỹ sư</option>
                                <option value="Thạc sĩ">Thạc sĩ</option>
                                <option value="Tiến sĩ">Tiến sĩ</option>
                                <option value="Phó Giáo sư">Phó Giáo sư</option>
                                <option value="Giáo sư">Giáo sư</option>
                            </select>
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
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 shadow-xs"
                        >
                            {submitting ? 'Đang lưu...' : editingItem ? 'Lưu thay đổi' : 'Thêm giảng viên'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
