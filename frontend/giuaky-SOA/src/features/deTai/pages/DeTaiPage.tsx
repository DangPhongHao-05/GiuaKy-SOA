import React, { useState } from 'react';
import { useDeTai } from '../hooks/useDeTai';
import { ServiceBadge } from '../../../components/shared/ServiceBadge';
import { DataTable, type ColumnDef } from '../../../components/shared/DataTable';
import { Modal } from '../../../components/shared/Modal';
import type { DeTai, CreateDeTaiDto } from '../types';

export const DeTaiPage: React.FC = () => {
    const { deTais, loading, isLive, error, fetchDeTais, createDeTai, updateDeTai, deleteDeTai } = useDeTai();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DeTai | null>(null);
    const [formData, setFormData] = useState<CreateDeTaiDto>({ tenDeTai: '', moTa: '' });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({ tenDeTai: '', moTa: '' });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: DeTai) => {
        setEditingItem(item);
        setFormData({ tenDeTai: item.tenDeTai, moTa: item.moTa || '' });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (item: DeTai) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa đề tài ID ${item.id}: "${item.tenDeTai}"?`)) {
            try {
                await deleteDeTai(item.id);
            } catch (err: any) {
                alert(err.message || 'Lỗi khi xóa đề tài');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tenDeTai.trim()) {
            setFormError('Vui lòng nhập tên đề tài');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            if (editingItem) {
                await updateDeTai(editingItem.id, formData);
            } else {
                await createDeTai(formData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setFormError(err.message || 'Có lỗi xảy ra khi lưu đề tài');
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnDef<DeTai>[] = [
        {
            header: 'Mã số',
            key: 'id',
            className: 'w-20 font-mono font-semibold text-gray-900',
            render: (item) => <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-mono font-bold text-xs">#{item.id}</span>,
        },
        {
            header: 'Tên đề tài tốt nghiệp',
            key: 'tenDeTai',
            className: 'min-w-[280px]',
            render: (item) => (
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.tenDeTai}</p>
                </div>
            ),
        },
        {
            header: 'Mô tả chi tiết',
            key: 'moTa',
            className: 'text-gray-500 max-w-[400px]',
            render: (item) => (
                <p className="line-clamp-2 text-xs text-gray-600">
                    {item.moTa || <span className="italic text-gray-400">(Chưa có mô tả)</span>}
                </p>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Service Banner */}
            <ServiceBadge serviceKey="deTai" isLive={isLive} />

            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchDeTais} className="underline font-bold">Thử lại</button>
                </div>
            )}

            {/* Main Table */}
            <DataTable<DeTai>
                title="Danh mục Đề tài Tốt nghiệp"
                description="Các đề tài nghiên cứu và phát triển được quản lý độc lập bởi DeTaiService"
                columns={columns}
                data={deTais}
                idKey="id"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchDeTais}
                searchPlaceholder="Tìm theo tên hoặc mô tả đề tài..."
                searchKeys={['tenDeTai', 'moTa']}
            />

            {/* Modal Add / Edit */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `Chỉnh sửa đề tài #${editingItem.id}` : 'Thêm mới đề tài tốt nghiệp'}
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
                            Tên đề tài <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: Xây dựng cổng thông tin quản lý đào tạo..."
                            value={formData.tenDeTai}
                            onChange={(e) => setFormData({ ...formData, tenDeTai: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mô tả chi tiết
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Nhập yêu cầu, mục tiêu công nghệ và phạm vi đề tài..."
                            value={formData.moTa || ''}
                            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition"
                        />
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
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 shadow-xs"
                        >
                            {submitting ? 'Đang gửi HTTP...' : editingItem ? 'Lưu thay đổi' : 'Thêm đề tài'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
