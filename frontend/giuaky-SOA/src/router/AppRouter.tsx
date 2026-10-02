import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardHome } from '../pages/DashboardHome';
import { DeTaiPage } from '../features/deTai/pages/DeTaiPage';
import { SinhVienPage } from '../features/sinhVien/pages/SinhVienPage';
import { GiangVienPage } from '../features/giangVien/pages/GiangVienPage';
import { DangKyPage } from '../features/dangKy/pages/DangKyPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/dashboard',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DashboardHome />,
            },
            {
                path: 'de-tai',
                element: <DeTaiPage />,
            },
            {
                path: 'sinh-vien',
                element: <SinhVienPage />,
            },
            {
                path: 'giang-vien',
                element: <GiangVienPage />,
            },
            {
                path: 'dang-ky',
                element: <DangKyPage />,
            },
        ],
    },
    {
        path: '*',
        element: (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md">
                    <div className="text-5xl mb-3">🔍</div>
                    <h2 className="text-xl font-bold text-gray-800">404 - Không tìm thấy trang</h2>
                    <p className="text-xs text-gray-500 mt-2 mb-6">
                        Đường dẫn bạn yêu cầu không tồn tại trong hệ thống SOA.
                    </p>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                        Quay lại Tổng quan Dashboard
                    </Link>
                </div>
            </div>
        ),
    },
]);

const AppRoutes: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
