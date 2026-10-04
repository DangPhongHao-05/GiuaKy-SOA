import React, { useState } from 'react';
import { useDangKy } from '../hooks/useDangKy';
import { ServiceBadge } from '../../../components/shared/ServiceBadge';
import { DataTable, type ColumnDef } from '../../../components/shared/DataTable';
import { Modal } from '../../../components/shared/Modal';
import type { DangKy, CreateDangKyDto, TrangThaiDangKy } from '../types';

export const DangKyPage: React.FC = () => {
    const {
        dangKys,
        sinhViens,
        deTais,
        loading,
        isLive,
        error,
        fetchAllData,
        createDangKy,
        updateDangKy,
        deleteDangKy,
    } = useDangKy();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DangKy | null>(null);
    const [formData, setFormData] = useState<CreateDangKyDto>({
        maSV: '',
        maDeTai: 0,
        ngayDangKy: new Date().toISOString().split('T')[0],
        trangThai: 'Chờ duyệt',
        ghiChu: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            maSV: sinhViens[0]?.maSV || '',
            maDeTai: deTais[0]?.id || 1,
            ngayDangKy: new Date().toISOString().split('T')[0],
            trangThai: 'Chờ duyệt',
            ghiChu: '',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: DangKy) => {
        setEditingItem(item);
        setFormData({
            maSV: item.maSV,
            maDeTai: item.maDeTai,
            ngayDangKy: item.ngayDangKy,
            trangThai: item.trangThai,
            ghiChu: item.ghiChu || '',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (item: DangKy) => {
        if (window.confirm(`Xác nhận hủy phiếu đăng ký #${item.id} của SV ${item.maSV}?`)) {
            try {
                await deleteDangKy(item.id);
            } catch (err: any) {
                alert(err.message || 'Lỗi khi hủy đăng ký');
            }
        }
    };

    const handleQuickStatusChange = async (item: DangKy, newStatus: TrangThaiDangKy) => {
        try {
            await updateDangKy(item.id, { trangThai: newStatus });
        } catch (err: any) {
            alert(err.message || 'Không thể cập nhật trạng thái');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.maSV || !formData.maDeTai) {
            setFormError('Vui lòng chọn Sinh viên và Đề tài');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            if (editingItem) {
                await updateDangKy(editingItem.id, formData);
            } else {
                await createDangKy(formData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setFormError(err.message || 'Có lỗi xảy ra khi lưu phiếu đăng ký');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: TrangThaiDangKy) => {
        switch (status) {
            case 'Đã duyệt':
                return 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold';
            case 'Từ chối':
                return 'bg-rose-50 text-rose-800 border-rose-400 font-bold';
            default:
                return 'bg-amber-50 text-amber-800 border-amber-400 font-bold';
        }
    };

    const columns: ColumnDef<DangKy>[] = [
        {
            header: 'Mã số',
            key: 'id',
            className: 'w-20 font-mono font-bold text-gray-900',
            render: (item) => <span>#{item.id}</span>,
        },
        {
            header: 'Sinh viên (SinhVien :7005)',
            key: 'maSV',
            render: (item) => {
                const sv = sinhViens.find((s) => s.maSV === item.maSV);
                return (
                    <div>
                        <span className="font-mono font-bold text-gray-900">{item.maSV}</span>
                        {sv && (
                            <span className="ml-2 text-gray-700">({sv.hoTen})</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Đề tài đăng ký (DeTai :7003)',
            key: 'maDeTai',
            className: 'max-w-[320px]',
            render: (item) => {
                const dt = deTais.find((d) => d.id === item.maDeTai);
                return (
                    <div>
                        <span className="font-medium text-gray-900 line-clamp-1">
                            {dt ? dt.tenDeTai : `Đề tài #${item.maDeTai}`}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Ngày nộp',
            key: 'ngayDangKy',
            className: 'text-xs text-gray-600 font-mono w-28',
        },
        {
            header: 'Trạng thái duyệt',
            key: 'trangThai',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`text-[11px] px-2 py-0.5 border font-mono ${getStatusBadge(
                            item.trangThai
                        )}`}
                    >
                        [{item.trangThai.toUpperCase()}]
                    </span>
                    {item.trangThai === 'Chờ duyệt' && (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                            <button
                                type="button"
                                onClick={() => handleQuickStatusChange(item, 'Đã duyệt')}
                                className="px-1.5 py-0.5 border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 cursor-pointer"
                                title="Phê duyệt phiếu"
                            >
                                [Duyệt]
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickStatusChange(item, 'Từ chối')}
                                className="px-1.5 py-0.5 border border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer"
                                title="Từ chối phiếu"
                            >
                                [Từ chối]
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Ghi chú',
            key: 'ghiChu',
            className: 'text-gray-500 max-w-[200px] text-xs',
            render: (item) => <span>{item.ghiChu || '-'}</span>,
        },
    ];

    return (
        <div className="space-y-3">
            <ServiceBadge serviceKey="dangKy" isLive={isLive} onRefresh={fetchAllData} />

            {/* SOA Integration Spec Note */}
            <div className="p-2.5 border border-gray-300 bg-white font-mono text-xs">
                <div className="font-bold text-gray-800 mb-0.5">
                    [SOA ORCHESTRATION: PHỐI HỢP ĐA DỊCH VỤ]
                </div>
                <div className="text-gray-600 font-sans text-xs">
                    Trang này phối hợp dữ liệu từ <strong>SinhVienService (:7005)</strong>, <strong>DeTaiService (:7003)</strong> và lưu trữ kết quả phê duyệt tại <strong>DangKyService (:7002)</strong> qua REST API.
                </div>
            </div>

            {error && (
                <div className="p-2 border border-rose-400 bg-rose-50 text-rose-800 text-xs font-mono flex items-center justify-between">
                    <span>[LỖI]: {error}</span>
                    <button
                        type="button"
                        onClick={fetchAllData}
                        className="px-2 py-0.5 border border-rose-300 bg-white hover:bg-rose-100 text-rose-800 cursor-pointer"
                    >
                        [Thử lại]
                    </button>
                </div>
            )}

            <DataTable<DangKy>
                title="DANH SÁCH ĐĂNG KÝ ĐỒ ÁN TỐT NGHIỆP"
                description="Quản lý bởi DangKyService (:7002) - Phối hợp liên dịch vụ"
                columns={columns}
                data={dangKys}
                idKey="id"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchAllData}
                searchPlaceholder="Mã SV, trạng thái hoặc ghi chú..."
                searchKeys={['maSV', 'trangThai', 'ghiChu']}
            />

            {/* Modal Wireframe */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `[CẬP NHẬT PHIẾU ĐĂNG KÝ: #${editingItem.id}]` : '[TẠO PHIẾU ĐĂNG KÝ MỚI]'}
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
                            Sinh viên đăng ký (SinhVienService :7005) *
                        </label>
                        <select
                            required
                            disabled={!!editingItem}
                            value={formData.maSV}
                            onChange={(e) => setFormData({ ...formData, maSV: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none disabled:bg-gray-100"
                        >
                            <option value="">-- Chọn sinh viên --</option>
                            {sinhViens.map((sv) => (
                                <option key={sv.maSV} value={sv.maSV}>
                                    {sv.maSV} - {sv.hoTen} ({sv.khoa})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Đề tài đăng ký (DeTaiService :7003) *
                        </label>
                        <select
                            required
                            value={formData.maDeTai}
                            onChange={(e) => setFormData({ ...formData, maDeTai: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                        >
                            <option value={0}>-- Chọn đề tài --</option>
                            {deTais.map((dt) => (
                                <option key={dt.id} value={dt.id}>
                                    #{dt.id} - {dt.tenDeTai}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Ngày đăng ký
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.ngayDangKy}
                                onChange={(e) => setFormData({ ...formData, ngayDangKy: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700 mb-1">
                                Trạng thái phê duyệt
                            </label>
                            <select
                                value={formData.trangThai}
                                onChange={(e) =>
                                    setFormData({ ...formData, trangThai: e.target.value as TrangThaiDangKy })
                                }
                                className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                            >
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Đã duyệt">Đã duyệt</option>
                                <option value="Từ chối">Từ chối</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Ghi chú xét duyệt
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Ghi chú kết quả xét duyệt hoặc lý do từ chối..."
                            value={formData.ghiChu}
                            onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
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
                            {submitting ? '[Đang lưu...]' : editingItem ? '[Lưu thay đổi]' : '[Tạo đăng ký]'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
