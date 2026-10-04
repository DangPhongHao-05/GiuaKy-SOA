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
                auth: true, // Auth service
                deTai: dtRes.isLive,
                sinhVien: svRes.isLive,
                giangVien: gvRes.isLive,
                dangKy: dkRes.isLive,
            });
        } catch {
            // Error
        } finally {
            setTestingConnectivity(false);
        }
    };

    useEffect(() => {
        testAllServices();

        // Load current base URLs
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
        // Reload test
        testAllServices();
    };

    return (
        <div className="space-y-8">
            {/* Top Welcome & Actions */}
            <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md mb-3 border border-white/10">
                        <span>🎓</span> Báo cáo Giữa kỳ — Kiến trúc Hướng Dịch vụ (SOA)
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Hệ thống Quản lý Đồ án Tốt nghiệp
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                        Mô hình phân tán gồm <strong>5 microservice độc lập</strong> (Auth, DeTai, SinhVien, GiangVien, DangKy) trao đổi dữ liệu qua giao thức HTTP/REST, với cơ sở dữ liệu riêng biệt theo nguyên lý SOA.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            onClick={testAllServices}
                            disabled={testingConnectivity}
                            className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className={testingConnectivity ? 'animate-spin' : ''}>🔄</span>
                            {testingConnectivity ? 'Đang ping services...' : 'Kiểm tra kết nối các Service'}
                        </button>

                        <button
                            onClick={() => setIsConfigModalOpen(true)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/20 transition flex items-center gap-1.5"
                        >
                            <span>⚙️</span>
                            Cấu hình Endpoint Service
                        </button>
                    </div>
                </div>

                {/* Decorative background shapes */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center text-9xl">
                    🌐
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                    to="/dashboard/de-tai"
                    className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-orange-300 transition group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Đề tài (:7003)
                        </span>
                        <span className="text-base p-2 bg-orange-50 rounded-xl group-hover:scale-110 transition">
                            📚
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{counts.deTai}</span>
                        <span className="text-xs text-gray-400">đề tài</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                        <span
                            className={`w-2 h-2 rounded-full ${
                                serviceStatuses.deTai ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                        />
                        <span className="text-gray-500">
                            {serviceStatuses.deTai ? 'Kết nối live' : 'Mock data fallback'}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/dashboard/sinh-vien"
                    className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Sinh viên (:7005)
                        </span>
                        <span className="text-base p-2 bg-emerald-50 rounded-xl group-hover:scale-110 transition">
                            🎓
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{counts.sinhVien}</span>
                        <span className="text-xs text-gray-400">sinh viên</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                        <span
                            className={`w-2 h-2 rounded-full ${
                                serviceStatuses.sinhVien ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                        />
                        <span className="text-gray-500">
                            {serviceStatuses.sinhVien ? 'Kết nối live' : 'Mock data fallback'}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/dashboard/giang-vien"
                    className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-purple-300 transition group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Giảng viên (:7004)
                        </span>
                        <span className="text-base p-2 bg-purple-50 rounded-xl group-hover:scale-110 transition">
                            👨‍🏫
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{counts.giangVien}</span>
                        <span className="text-xs text-gray-400">thầy / cô</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                        <span
                            className={`w-2 h-2 rounded-full ${
                                serviceStatuses.giangVien ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                        />
                        <span className="text-gray-500">
                            {serviceStatuses.giangVien ? 'Kết nối live' : 'Mock data fallback'}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/dashboard/dang-ky"
                    className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-red-300 transition group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Đăng ký (:7002)
                        </span>
                        <span className="text-base p-2 bg-rose-50 rounded-xl group-hover:scale-110 transition">
                            📝
                        </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">{counts.dangKy}</span>
                        <span className="text-xs text-gray-400">hồ sơ</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                        <span
                            className={`w-2 h-2 rounded-full ${
                                serviceStatuses.dangKy ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                        />
                        <span className="text-gray-500">
                            {serviceStatuses.dangKy ? 'Kết nối live' : 'Mock data fallback'}
                        </span>
                    </div>
                </Link>
            </div>

            {/* Architecture Diagram Box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">
                            Sơ đồ phối hợp Kiến trúc Hướng Dịch vụ (SOA)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Minh họa các kết nối HTTP/REST độc lập giữa Client và từng cụm Service
                        </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-mono rounded-full font-medium">
                        HTTP/REST Protocols
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                    {Object.values(DEFAULT_SERVICE_CONFIG).map((cfg) => {
                        const isLive = serviceStatuses[cfg.key];
                        return (
                            <div
                                key={cfg.key}
                                className="p-4 rounded-xl border transition-all text-xs space-y-2.5 bg-gray-50/50"
                                style={{
                                    borderColor: `${cfg.color}30`,
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className="font-bold text-xs"
                                        style={{ color: cfg.color }}
                                    >
                                        {cfg.name}
                                    </span>
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white font-bold text-gray-600 border border-gray-200">
                                        :{cfg.port}
                                    </span>
                                </div>

                                <p className="text-[11px] text-gray-500 line-clamp-2">
                                    {cfg.description}
                                </p>

                                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-gray-400">Kết nối:</span>
                                    {isLive ? (
                                        <span className="text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                            ✓ Live Port
                                        </span>
                                    ) : (
                                        <span className="text-amber-700 font-medium bg-amber-100/70 px-1.5 py-0.5 rounded">
                                            ⚡ Mock Fallback
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal cấu hình Endpoint (cho phép đổi IP/Port linh hoạt) */}
            <Modal
                isOpen={isConfigModalOpen}
                title="Cấu hình Endpoint các Service SOA"
                onClose={() => setIsConfigModalOpen(false)}
                maxWidth="lg"
            >
                <form onSubmit={handleSaveUrls} className="space-y-4 text-xs">
                    <p className="text-gray-500 leading-relaxed">
                        Bạn có thể linh hoạt thay đổi địa chỉ IP hoặc cổng port của từng microservice tại đây mà không cần sửa code giao diện. Cấu hình được lưu trong trình duyệt.
                    </p>

                    {savedMsg && (
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium border border-emerald-200">
                            ✓ Đã cập nhật endpoint thành công!
                        </div>
                    )}

                    <div className="space-y-3">
                        {Object.values(DEFAULT_SERVICE_CONFIG).map((cfg) => (
                            <div key={cfg.key} className="space-y-1">
                                <label className="flex items-center justify-between font-semibold text-gray-700">
                                    <span>{cfg.name} ({cfg.displayName})</span>
                                    <span className="font-mono text-[11px] text-gray-400">Default: :{cfg.port}</span>
                                </label>
                                <input
                                    type="text"
                                    value={customUrls[cfg.key] || ''}
                                    onChange={(e) =>
                                        setCustomUrls({ ...customUrls, [cfg.key]: e.target.value })
                                    }
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                const resetUrls: Record<string, string> = {};
                                Object.keys(DEFAULT_SERVICE_CONFIG).forEach((k) => {
                                    resetUrls[k] = DEFAULT_SERVICE_CONFIG[k].baseURL;
                                });
                                setCustomUrls(resetUrls);
                            }}
                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Khôi phục mặc định
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-xs"
                        >
                            Lưu cấu hình
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
