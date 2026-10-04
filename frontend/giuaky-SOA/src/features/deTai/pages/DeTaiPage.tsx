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
        if (window.confirm(`Xác nhận xóa đề tài ID ${item.id}: "${item.tenDeTai}"?`)) {
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
            className: 'w-20 font-mono font-bold text-gray-900',
            render: (item) => <span>#{item.id}</span>,
        },
        {
            header: 'Tên đề tài tốt nghiệp',
            key: 'tenDeTai',
            className: 'font-semibold text-gray-900 min-w-[280px]',
            render: (item) => <span>{item.tenDeTai}</span>,
        },
        {
            header: 'Mô tả chi tiết',
            key: 'moTa',
            className: 'text-gray-600 max-w-[400px]',
            render: (item) => (
                <span className="line-clamp-2">
                    {item.moTa || <span className="italic text-gray-400">[Không có mô tả]</span>}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-3">
            <ServiceBadge serviceKey="deTai" isLive={isLive} onRefresh={fetchDeTais} />

            {error && (
                <div className="p-2 border border-rose-400 bg-rose-50 text-rose-800 text-xs font-mono flex items-center justify-between">
                    <span>[LỖI]: {error}</span>
                    <button
                        type="button"
                        onClick={fetchDeTais}
                        className="px-2 py-0.5 border border-rose-300 bg-white hover:bg-rose-100 text-rose-800 cursor-pointer"
                    >
                        [Thử lại]
                    </button>
                </div>
            )}

            <DataTable<DeTai>
                title="DANH MỤC ĐỀ TÀI TỐT NGHIỆP"
                description="Quản lý bởi DeTaiService (:7003) - Dữ liệu độc lập"
                columns={columns}
                data={deTais}
                idKey="id"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchDeTais}
                searchPlaceholder="Tên đề tài hoặc từ khóa..."
                searchKeys={['id', 'tenDeTai', 'moTa']}
            />

            {/* Modal Wireframe */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `[CẬP NHẬT ĐỀ TÀI: #${editingItem.id}]` : '[THÊM ĐỀ TÀI MỚI]'}
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
                            Tên đề tài tốt nghiệp *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ví dụ: Xây dựng hệ thống học trực tuyến theo kiến trúc SOA"
                            value={formData.tenDeTai}
                            onChange={(e) => setFormData({ ...formData, tenDeTai: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Mô tả mục tiêu & phạm vi đề tài
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Mô tả tóm tắt nội dung nghiên cứu, công nghệ áp dụng..."
                            value={formData.moTa || ''}
                            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none font-sans"
                        />
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
                            {submitting ? '[Đang lưu...]' : editingItem ? '[Lưu thay đổi]' : '[Thêm đề tài]'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
