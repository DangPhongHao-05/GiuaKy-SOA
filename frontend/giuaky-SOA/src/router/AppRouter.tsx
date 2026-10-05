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
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-mono text-xs">
                <div className="text-center bg-white p-6 border-2 border-gray-800 max-w-md w-full shadow-sm">
                    <div className="font-bold text-gray-400 text-lg mb-2">[HTTP 404]</div>
                    <h2 className="text-sm font-bold text-gray-900">KHÔNG TÌM THẤY TRANG YÊU CẦU</h2>
                    <p className="text-xs text-gray-500 mt-2 mb-4 font-sans">
                        Endpoint hoặc tuyến đường dẫn không tồn tại trong hệ thống SOA.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block px-3 py-1.5 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white font-bold"
                    >
                        [Quay lại Bảng điều khiển SOA]
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
