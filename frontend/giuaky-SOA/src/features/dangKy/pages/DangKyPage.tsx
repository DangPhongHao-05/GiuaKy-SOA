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
        if (window.confirm(`Bạn có chắc muốn hủy phiếu đăng ký #${item.id} của SV ${item.maSV}?`)) {
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

    const getStatusStyle = (status: TrangThaiDangKy) => {
        switch (status) {
            case 'Đã duyệt':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Từ chối':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    const columns: ColumnDef<DangKy>[] = [
        {
            header: 'Mã số',
            key: 'id',
            className: 'w-20',
            render: (item) => (
                <span className="font-mono font-bold text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">
                    #{item.id}
                </span>
            ),
        },
        {
            header: 'Sinh viên đăng ký (SinhVienService :5005)',
            key: 'maSV',
            render: (item) => {
                const sv = sinhViens.find((s) => s.maSV === item.maSV);
                return (
                    <div>
                        <span className="font-mono font-semibold text-xs text-gray-900">
                            {item.maSV}
                        </span>
                        {sv && (
                            <span className="ml-2 text-xs text-gray-600 font-medium">
                                - {sv.hoTen}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Đề tài lựa chọn (DeTaiService :5003)',
            key: 'maDeTai',
            className: 'max-w-[320px]',
            render: (item) => {
                const dt = deTais.find((d) => d.id === item.maDeTai);
                return (
                    <div>
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                            {dt ? dt.tenDeTai : `Đề tài #${item.maDeTai}`}
                        </p>
                    </div>
                );
            },
        },
        {
            header: 'Ngày nộp',
            key: 'ngayDangKy',
            className: 'text-xs text-gray-500 font-mono',
        },
        {
            header: 'Trạng thái duyệt',
            key: 'trangThai',
            render: (item) => (
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusStyle(
                            item.trangThai
                        )}`}
                    >
                        {item.trangThai}
                    </span>
                    {item.trangThai === 'Chờ duyệt' && (
                        <div className="flex items-center gap-1 ml-1">
                            <button
                                onClick={() => handleQuickStatusChange(item, 'Đã duyệt')}
                                className="text-[11px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded font-medium transition"
                                title="Phê duyệt nhanh"
                            >
                                ✓ Duyệt
                            </button>
                            <button
                                onClick={() => handleQuickStatusChange(item, 'Từ chối')}
                                className="text-[11px] px-1.5 py-0.5 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded font-medium transition"
                                title="Từ chối nhanh"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Ghi chú',
            key: 'ghiChu',
            className: 'text-xs text-gray-500 max-w-[200px]',
            render: (item) => <span className="line-clamp-1">{item.ghiChu || '-'}</span>,
        },
    ];

    return (
        <div className="space-y-6">
            <ServiceBadge serviceKey="dangKy" isLive={isLive} />

            {/* SOA Integration Highlight Banner */}
            <div className="p-4 bg-linear-to-r from-blue-50 via-purple-50 to-orange-50 rounded-2xl border border-blue-100/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-base">🔄</span>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Đặc trưng SOA: Phối hợp đa dịch vụ (Multi-Service Orchestration)
                    </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                    Trang Đăng Ký này đồng thời giao tiếp với <strong>SinhVienService</strong> (cổng 5005) để đối chiếu thông tin người học, <strong>DeTaiService</strong> (cổng 5003) để kiểm tra danh mục đề tài, và ghi dữ liệu phê duyệt tại <strong>DangKyService</strong> (cổng 5002) hoàn toàn qua giao thức <strong>HTTP/REST</strong>.
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchAllData} className="underline font-bold">Thử lại</button>
                </div>
            )}

            <DataTable<DangKy>
                title="Quản lý Đăng ký Đề tài Tốt nghiệp"
                description="Hồ sơ đăng ký đồ án của sinh viên được quản lý độc lập tại DangKyService (:5002)"
                columns={columns}
                data={dangKys}
                idKey="id"
                loading={loading}
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onRefresh={fetchAllData}
                searchPlaceholder="Tìm theo Mã SV, trạng thái hoặc ghi chú..."
                searchKeys={['maSV', 'trangThai', 'ghiChu']}
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                title={editingItem ? `Cập nhật phiếu đăng ký #${editingItem.id}` : 'Tạo phiếu đăng ký đồ án mới'}
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
                            Chọn Sinh viên (từ SinhVienService :5005) <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.maSV}
                            onChange={(e) => setFormData({ ...formData, maSV: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition"
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
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Chọn Đề tài (từ DeTaiService :5003) <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.maDeTai}
                            onChange={(e) => setFormData({ ...formData, maDeTai: Number(e.target.value) })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition"
                        >
                            <option value="0">-- Chọn đề tài --</option>
                            {deTais.map((dt) => (
                                <option key={dt.id} value={dt.id}>
                                    #{dt.id} - {dt.tenDeTai}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Ngày đăng ký
                            </label>
                            <input
                                type="date"
                                value={formData.ngayDangKy}
                                onChange={(e) => setFormData({ ...formData, ngayDangKy: e.target.value })}
                                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Trạng thái duyệt
                            </label>
                            <select
                                value={formData.trangThai}
                                onChange={(e) => setFormData({ ...formData, trangThai: e.target.value as TrangThaiDangKy })}
                                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition"
                            >
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Đã duyệt">Đã duyệt</option>
                                <option value="Từ chối">Từ chối</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Ghi chú / Nhận xét của hội đồng
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Ghi chú điều kiện hoặc lý do duyệt / từ chối..."
                            value={formData.ghiChu || ''}
                            onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition"
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
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 shadow-xs"
                        >
                            {submitting ? 'Đang lưu...' : editingItem ? 'Lưu thay đổi' : 'Nộp đơn đăng ký'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
