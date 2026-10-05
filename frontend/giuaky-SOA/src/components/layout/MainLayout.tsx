import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ApiCallLog } from '../shared/ApiCallLog';

export const MainLayout: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = (pathname: string) => {
        if (pathname.includes('/de-tai')) return '[DeTaiService :7003] Quản lý Đề tài';
        if (pathname.includes('/sinh-vien')) return '[SinhVienService :7005] Quản lý Sinh viên';
        if (pathname.includes('/giang-vien')) return '[GiangVienService :7004] Hội đồng Giảng viên';
        if (pathname.includes('/dang-ky')) return '[DangKyService :7002] Quản lý Đăng ký Đồ án';
        return '[SOA HUB] Tổng quan Kiến trúc Hướng Dịch vụ';
    };

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
            {/* Sidebar cho Desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Sidebar cho Mobile (Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 shadow-lg">
                        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* Vùng nội dung chính */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-11 bg-white border-b border-gray-300 flex items-center justify-between px-3 sm:px-4 shrink-0 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="px-2 py-0.5 border border-gray-300 hover:border-gray-500 bg-gray-50 text-gray-700 lg:hidden cursor-pointer"
                        >
                            [Menu]
                        </button>
                        <div>
                            <span className="font-bold text-gray-900">
                                {getPageTitle(location.pathname)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-[11px] text-gray-500">
                            Protocol: HTTP/REST JSON
                        </span>
                        <span className="px-2 py-0.5 border border-emerald-400 bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                            [SYSTEM READY]
                        </span>
                    </div>
                </header>

                {/* Main Body */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* REST API Console Panel */}
            <ApiCallLog />
        </div>
    );
};
