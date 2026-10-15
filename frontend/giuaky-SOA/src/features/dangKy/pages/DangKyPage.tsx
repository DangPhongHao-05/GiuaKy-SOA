import React, { useState } from 'react';
import { useDangKy } from '../hooks/useDangKy';
import { ServiceBadge } from '../../../components/shared/ServiceBadge';
import { DataTable, type ColumnDef } from '../../../components/shared/DataTable';
import { Modal } from '../../../components/shared/Modal';
import type { CreateDangKyDto } from '../types';

export const DangKyPage: React.FC = () => {
    const {
        dangKys,
        sinhViens,
        deTais,
        giangViens,
        loading,
        isLive,
        error,
        fetchAllData,
        createDangKy,
    } = useDangKy();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<CreateDangKyDto>({
        sinhVienId: 0,
        deTaiId: 0,
        giangVienId: 0,
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenAdd = () => {
        const defaultSvId = sinhViens[0]?.id || 0;
        const defaultDtId = deTais[0]?.id || 0;
        const defaultGvId = giangViens[0]?.id || 0;

        setFormData({
            sinhVienId: defaultSvId,
            deTaiId: defaultDtId,
            giangVienId: defaultGvId,
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.sinhVienId || !formData.deTaiId || !formData.giangVienId) {
            setFormError('Vui lòng chọn đầy đủ Sinh viên, Đề tài và Giảng viên hướng dẫn');
            return;
        }

        setSubmitting(true);
        setFormError('');

        try {
            await createDangKy({
                sinhVienId: Number(formData.sinhVienId),
                deTaiId: Number(formData.deTaiId),
                giangVienId: Number(formData.giangVienId),
            });
            setIsModalOpen(false);
        } catch (err: any) {
            setFormError(err.message || 'Có lỗi xảy ra khi tạo phiếu đăng ký');
        } finally {
            setSubmitting(false);
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            header: 'Sinh viên (SinhVien :7005)',
            key: 'sinhVienId',
            render: (item) => {
                const sv = sinhViens.find((s) => s.id === item.sinhVienId);
                return (
                    <div>
                        <span className="font-mono font-bold text-gray-900">
                            {sv ? sv.maSv : `Mã SV #${item.sinhVienId}`}
                        </span>
                        {sv && (
                            <span className="ml-2 text-gray-700">({sv.hoTen})</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Đề tài đăng ký (DeTai :7003)',
            key: 'deTaiId',
            className: 'max-w-[320px]',
            render: (item) => {
                const dt = deTais.find((d) => d.id === item.deTaiId);
                return (
                    <div>
                        <span className="font-medium text-gray-900 line-clamp-1">
                            {dt ? dt.tenDeTai : `Đề tài #${item.deTaiId}`}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Giảng viên hướng dẫn (GiangVien :7004)',
            key: 'giangVienId',
            render: (item) => {
                const gv = giangViens.find((g) => g.id === item.giangVienId);
                return (
                    <div>
                        <span className="font-bold text-gray-900">
                            {gv ? gv.hoTen : `Giảng viên #${item.giangVienId}`}
                        </span>
                        {gv && (
                            <span className="ml-2 text-gray-500 text-xs">
                                ({gv.boMon || gv.hocVi || gv.maGV})
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    const dataWithKeys = dangKys.map((item, idx) => ({
        ...item,
        rowKey: `${item.sinhVienId}-${item.deTaiId}-${item.giangVienId}-${idx}`,
    }));

    return (
        <div className="space-y-3">
            <ServiceBadge serviceKey="dangKy" isLive={isLive} onRefresh={fetchAllData} />

            {/* SOA Integration Spec Note */}
            <div className="p-2.5 border border-gray-300 bg-white font-mono text-xs">
                <div className="font-bold text-gray-800 mb-0.5">
                    [SOA ORCHESTRATION: PHỐI HỢP LIÊN DỊCH VỤ]
                </div>
                <div className="text-gray-600 font-sans text-xs">
                    Trang này phối hợp dữ liệu từ <strong>SinhVienService (:7005)</strong>, <strong>DeTaiService (:7003)</strong>, <strong>GiangVienService (:7004)</strong> và lưu trữ kết quả tại <strong>DangKyService (:7002)</strong> qua REST API.
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

            <DataTable<any>
                title="DANH SÁCH ĐĂNG KÝ ĐỒ ÁN TỐT NGHIỆP"
                description="Quản lý bởi DangKyService (:7002) - Phối hợp liên dịch vụ (SinhVien, DeTai, GiangVien)"
                columns={columns}
                data={dataWithKeys}
                idKey="rowKey"
                loading={loading}
                onAdd={handleOpenAdd}
                onRefresh={fetchAllData}
                searchPlaceholder="Tìm kiếm phiếu đăng ký..."
            />

            {/* Modal Wireframe */}
            <Modal
                isOpen={isModalOpen}
                title="[TẠO PHIẾU ĐĂNG KÝ MỚI]"
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
                            value={formData.sinhVienId || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, sinhVienId: Number(e.target.value) })
                            }
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                        >
                            <option value="">-- Chọn sinh viên --</option>
                            {sinhViens.map((sv) => (
                                <option key={sv.id} value={sv.id}>
                                    {sv.maSv} - {sv.hoTen} ({sv.lop || 'Chưa phân lớp'})
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
                            value={formData.deTaiId || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, deTaiId: Number(e.target.value) })
                            }
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                        >
                            <option value="">-- Chọn đề tài --</option>
                            {deTais.map((dt) => (
                                <option key={dt.id} value={dt.id}>
                                    #{dt.id} - {dt.tenDeTai}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700 mb-1">
                            Giảng viên hướng dẫn (GiangVienService :7004) *
                        </label>
                        <select
                            required
                            value={formData.giangVienId || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, giangVienId: Number(e.target.value) })
                            }
                            className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                        >
                            <option value="">-- Chọn giảng viên hướng dẫn --</option>
                            {giangViens.map((gv) => (
                                <option key={gv.id} value={gv.id}>
                                    [{gv.maGV || gv.id}] {gv.hoTen} - {gv.boMon || gv.hocVi || 'Giảng viên'}
                                </option>
                            ))}
                        </select>
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
                            {submitting ? '[Đang tạo...]' : '[Tạo đăng ký]'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
