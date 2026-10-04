import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_SERVICE_CONFIG, getServiceConfig, updateServiceBaseUrl } from '../config/apiConfig';
import { Modal } from '../components/shared/Modal';
import { deTaiApi } from '../features/deTai/api';
import { sinhVienApi } from '../features/sinhVien/api';
import { giangVienApi } from '../features/giangVien/api';
import { dangKyApi } from '../features/dangKy/api';

export const DashboardHome: React.FC = () => {
    const [counts, setCounts] = useState({
        deTai: 0,
        sinhVien: 0,
        giangVien: 0,
        dangKy: 0,
    });
    const [serviceStatuses, setServiceStatuses] = useState<Record<string, boolean>>({});
    const [testingConnectivity, setTestingConnectivity] = useState(false);

    // Modal cấu hình endpoint
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [customUrls, setCustomUrls] = useState<Record<string, string>>({});
    const [savedMsg, setSavedMsg] = useState(false);

    const testAllServices = async () => {
        setTestingConnectivity(true);
        try {
            const [dtRes, svRes, gvRes, dkRes] = await Promise.all([
                deTaiApi.getAll(),
                sinhVienApi.getAll(),
                giangVienApi.getAll(),
                dangKyApi.getAll(),
            ]);

            setCounts({
                deTai: dtRes.data.length,
                sinhVien: svRes.data.length,
                giangVien: gvRes.data.length,
                dangKy: dkRes.data.length,
            });

            setServiceStatuses({
                auth: true,
                deTai: dtRes.isLive,
                sinhVien: svRes.isLive,
                giangVien: gvRes.isLive,
                dangKy: dkRes.isLive,
            });
        } catch {
            // Keep previous statuses
        } finally {
            setTestingConnectivity(false);
        }
    };

    useEffect(() => {
        testAllServices();

        const initialUrls: Record<string, string> = {};
        Object.keys(DEFAULT_SERVICE_CONFIG).forEach((k) => {
            initialUrls[k] = getServiceConfig(k as any).baseURL;
        });
        setCustomUrls(initialUrls);
    }, []);

    const handleSaveUrls = (e: React.FormEvent) => {
        e.preventDefault();
        Object.entries(customUrls).forEach(([k, url]) => {
            updateServiceBaseUrl(k as any, url);
        });
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
        testAllServices();
    };

    return (
        <div className="space-y-4">
            {/* Top Spec Header */}
            <div className="border border-gray-300 bg-white p-4 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                    <div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                            Kiến trúc Hướng Dịch vụ (SOA) - Báo cáo giữa kỳ
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mt-0.5">
                            BẢNG ĐIỀU KHIỂN KIỂM THỬ BACKEND MICROSERVICES
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={testAllServices}
                            disabled={testingConnectivity}
                            className="px-3 py-1.5 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                        >
                            {testingConnectivity ? '[Đang ping services...]' : '[Kiểm tra kết nối toàn bộ]'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsConfigModalOpen(true)}
                            className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 text-xs cursor-pointer"
                        >
                            [Cấu hình Endpoint URLs]
                        </button>
                    </div>
                </div>

                <div className="pt-2 text-xs text-gray-600 font-sans">
                    Mô hình 5 microservices độc lập giao tiếp qua HTTP/REST JSON:
                    <span className="font-mono text-gray-800 ml-1">
                        Auth (:7001), DangKy (:7002), DeTai (:7003), GiangVien (:7004), SinhVien (:7005).
                    </span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                    to="/dashboard/de-tai"
                    className="p-3 bg-white border border-gray-300 hover:border-gray-500 transition block font-mono"
                >
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>[DeTaiService]</span>
                        <span>:7003</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                        {counts.deTai}
                    </div>
                    <div className="mt-1 text-[11px] flex justify-between items-center">
                        <span className="text-gray-500">Đề tài tốt nghiệp</span>
                        <span
                            className={`px-1 text-[10px] font-bold ${
                                serviceStatuses.deTai
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                        >
                            {serviceStatuses.deTai ? 'LIVE' : 'MOCK'}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/dashboard/sinh-vien"
                    className="p-3 bg-white border border-gray-300 hover:border-gray-500 transition block font-mono"
                >
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>[SinhVienService]</span>
                        <span>:7005</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                        {counts.sinhVien}
                    </div>
                    <div className="mt-1 text-[11px] flex justify-between items-center">
                        <span className="text-gray-500">Hồ sơ sinh viên</span>
                        <span
                            className={`px-1 text-[10px] font-bold ${
                                serviceStatuses.sinhVien
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                        >
                            {serviceStatuses.sinhVien ? 'LIVE' : 'MOCK'}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/dashboard/giang-vien"
                    className="p-3 bg-white border border-gray-300 hover:border-gray-500 transition block font-mono"
                >
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>[GiangVienService]</span>
                        <span>:7004</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                        {counts.giangVien}
                    </div>
                    <div className="mt-1 text-[11px] flex justify-between items-center">
                        <span className="text-gray-500">Giảng viên / Hội đồng</span>
                        <span
                            className={`px-1 text-[10px] font-bold ${
                                serviceStatuses.giangVien
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                        >
                            {serviceStatuses.giangVien ? 'LIVE' : 'MOCK'}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/dashboard/dang-ky"
                    className="p-3 bg-white border border-gray-300 hover:border-gray-500 transition block font-mono"
                >
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>[DangKyService]</span>
                        <span>:7002</span>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">
                        {counts.dangKy}
                    </div>
                    <div className="mt-1 text-[11px] flex justify-between items-center">
                        <span className="text-gray-500">Phiếu đăng ký đề tài</span>
                        <span
                            className={`px-1 text-[10px] font-bold ${
                                serviceStatuses.dangKy
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                        >
                            {serviceStatuses.dangKy ? 'LIVE' : 'MOCK'}
                        </span>
                    </div>
                </Link>
            </div>

            {/* Service Testing Matrix */}
            <div className="border border-gray-300 bg-white">
                <div className="p-3 border-b border-gray-300 bg-gray-50 font-mono text-xs flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                        MA TRẬN DỊCH VỤ MICROSERVICES (SERVICE SPEC MATRIX)
                    </span>
                    <span className="text-[11px] text-gray-500">
                        Kiểm thử trạng thái thời gian thực
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-[11px] uppercase border-b border-gray-300">
                            <tr>
                                <th className="px-3 py-2 border-r border-gray-200">Tên dịch vụ</th>
                                <th className="px-3 py-2 border-r border-gray-200">Cổng Port</th>
                                <th className="px-3 py-2 border-r border-gray-200">Giao thức</th>
                                <th className="px-3 py-2 border-r border-gray-200">Base URL cấu hình</th>
                                <th className="px-3 py-2 border-r border-gray-200">Trạng thái kết nối</th>
                                <th className="px-3 py-2 text-right">Điều hướng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 font-mono text-xs">
                            {Object.values(DEFAULT_SERVICE_CONFIG).map((cfg) => {
                                const isLive = serviceStatuses[cfg.key];
                                const currentUrl = getServiceConfig(cfg.key).baseURL;
                                const linkMap: Record<string, string> = {
                                    deTai: '/dashboard/de-tai',
                                    sinhVien: '/dashboard/sinh-vien',
                                    giangVien: '/dashboard/giang-vien',
                                    dangKy: '/dashboard/dang-ky',
                                    auth: '/',
                                };

                                return (
                                    <tr key={cfg.key} className="hover:bg-gray-50">
                                        <td className="px-3 py-2.5 font-bold text-gray-900 border-r border-gray-200">
                                            {cfg.name}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-700 border-r border-gray-200 font-bold">
                                            :{cfg.port}
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-600 border-r border-gray-200 text-[11px]">
                                            HTTP/REST JSON
                                        </td>
                                        <td className="px-3 py-2.5 text-gray-600 border-r border-gray-200 text-[11px]">
                                            {currentUrl}
                                        </td>
                                        <td className="px-3 py-2.5 border-r border-gray-200">
                                            <span
                                                className={`px-2 py-0.5 text-[10px] font-bold border ${
                                                    isLive
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                                                        : 'bg-amber-50 text-amber-800 border-amber-400'
                                                }`}
                                            >
                                                {isLive ? '[ONLINE - LIVE]' : '[FALLBACK MOCK]'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            {linkMap[cfg.key] && (
                                                <Link
                                                    to={linkMap[cfg.key]}
                                                    className="px-2 py-0.5 border border-gray-300 hover:border-gray-500 bg-white text-gray-700 text-xs"
                                                >
                                                    [Mở trang]
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal cấu hình Endpoint */}
            <Modal
                isOpen={isConfigModalOpen}
                title="[CẤU HÌNH ENDPOINT URL CHO CÁC SERVICES]"
                onClose={() => setIsConfigModalOpen(false)}
                maxWidth="lg"
            >
                <form onSubmit={handleSaveUrls} className="space-y-3 font-mono text-xs">
                    <p className="text-gray-600 font-sans leading-relaxed text-xs">
                        Thay đổi địa chỉ IP hoặc cổng port của từng microservice để kiểm thử backend chạy trên máy khác hoặc docker container. Cấu hình được lưu vào trình duyệt.
                    </p>

                    {savedMsg && (
                        <div className="p-2 border border-emerald-400 bg-emerald-50 text-emerald-800 text-xs font-bold">
                            [OK] Đã cập nhật cấu hình thành công!
                        </div>
                    )}

                    <div className="space-y-2">
                        {Object.values(DEFAULT_SERVICE_CONFIG).map((cfg) => (
                            <div key={cfg.key} className="p-2 border border-gray-200 bg-gray-50">
                                <label className="flex items-center justify-between font-bold text-gray-800 mb-1">
                                    <span>{cfg.name}</span>
                                    <span className="text-[11px] text-gray-500">Mặc định: :{cfg.port}</span>
                                </label>
                                <input
                                    type="text"
                                    value={customUrls[cfg.key] || ''}
                                    onChange={(e) =>
                                        setCustomUrls({ ...customUrls, [cfg.key]: e.target.value })
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                const resetUrls: Record<string, string> = {};
                                Object.keys(DEFAULT_SERVICE_CONFIG).forEach((k) => {
                                    resetUrls[k] = DEFAULT_SERVICE_CONFIG[k].baseURL;
                                });
                                setCustomUrls(resetUrls);
                            }}
                            className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs cursor-pointer"
                        >
                            [Khôi phục mặc định]
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
                        >
                            [Lưu cấu hình]
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
