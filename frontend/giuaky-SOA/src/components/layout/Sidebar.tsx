import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { DEFAULT_SERVICE_CONFIG } from '../../config/apiConfig';

interface SidebarProps {
    onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    const navItems = [
        {
            to: '/dashboard',
            end: true,
            tag: '[HUB]',
            label: 'Tổng quan hệ thống',
            badge: 'ALL',
        },
        {
            to: '/dashboard/de-tai',
            tag: '[DT]',
            label: 'Quản lý Đề tài',
            badge: ':7003',
        },
        {
            to: '/dashboard/sinh-vien',
            tag: '[SV]',
            label: 'Quản lý Sinh viên',
            badge: ':7005',
        },
        {
            to: '/dashboard/giang-vien',
            tag: '[GV]',
            label: 'Hội đồng Giảng viên',
            badge: ':7004',
        },
        {
            to: '/dashboard/dang-ky',
            tag: '[DK]',
            label: 'Đăng ký Đồ án',
            badge: ':7002',
        },
    ];

    return (
        <aside className="w-64 bg-gray-950 text-gray-200 flex flex-col h-screen shrink-0 border-r border-gray-800 font-mono text-xs">
            {/* Header / Brand */}
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <div className="font-bold text-gray-100 tracking-wider text-sm">
                        [SOA CONSOLE]
                    </div>
                    <div className="text-[10px] text-gray-400">
                        Kiến trúc Hướng Dịch vụ
                    </div>
                </div>

                {onCloseMobile && (
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="px-2 py-0.5 border border-gray-700 hover:border-gray-500 text-gray-300 lg:hidden text-[11px] cursor-pointer"
                    >
                        [Đóng]
                    </button>
                )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    --- Dịch vụ microservices ---
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-2.5 py-2 border text-xs transition-colors ${
                                isActive
                                    ? 'bg-gray-100 text-black border-white font-bold'
                                    : 'text-gray-300 border-transparent hover:border-gray-700 hover:bg-gray-900'
                            }`
                        }
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] opacity-75">{item.tag}</span>
                            <span>{item.label}</span>
                        </div>
                        <span className="text-[10px] px-1 py-0.2 bg-gray-800 border border-gray-700 text-gray-300 font-mono">
                            {item.badge}
                        </span>
                    </NavLink>
                ))}

                {/* Ports specs */}
                <div className="pt-4 px-1">
                    <div className="p-2.5 bg-gray-900 border border-gray-800 text-[11px] space-y-1.5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-800">
                            Cổng dịch vụ (HTTP):
                        </div>
                        {Object.values(DEFAULT_SERVICE_CONFIG).map((cfg) => (
                            <div key={cfg.key} className="flex justify-between items-center text-gray-400">
                                <span className="truncate max-w-[130px]">{cfg.name}</span>
                                <span className="text-gray-200 font-bold">:{cfg.port}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer & logout */}
            <div className="p-3 border-t border-gray-800 bg-black flex items-center justify-between">
                <div>
                    <div className="font-semibold text-gray-300 text-[11px]">Auth: :7001</div>
                    <div className="text-[10px] text-gray-500">JWT / REST</div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    title="Đăng xuất khỏi hệ thống"
                    className="px-2 py-1 border border-rose-800 bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-[11px] cursor-pointer"
                >
                    [Thoát]
                </button>
            </div>
        </aside>
    );
};
