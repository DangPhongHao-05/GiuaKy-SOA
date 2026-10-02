import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ApiCallLog } from '../shared/ApiCallLog';

export const MainLayout: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = (pathname: string) => {
        if (pathname.includes('/de-tai')) return 'Quản lý Đề tài (DeTaiService :5003)';
        if (pathname.includes('/sinh-vien')) return 'Quản lý Sinh viên (SinhVienService :5005)';
        if (pathname.includes('/giang-vien')) return 'Hội đồng Giảng viên (GiangVienService :5004)';
        if (pathname.includes('/dang-ky')) return 'Quản lý Đăng ký Đồ án (DangKyService :5002)';
        return 'Tổng quan Kiến trúc Hướng Dịch vụ (SOA)';
    };

    return (
        <div className="flex h-screen bg-slate-50 text-gray-800 font-sans overflow-hidden">
            {/* Sidebar cho Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Sidebar cho Mobile (Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 shadow-2xl">
                        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* Vùng nội dung chính */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                                {getPageTitle(location.pathname)}
                            </h1>
                            <p className="text-[11px] text-gray-400 font-mono hidden sm:block">
                                Giao thức trao đổi: JSON qua HTTP/REST
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>SOA Services Active</span>
                        </div>
                    </div>
                </header>

                {/* Main Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Floating SOA Real-time REST API Logger Panel */}
            <ApiCallLog />
        </div>
    );
};
