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
            label: 'Tổng quan kiến trúc SOA',
            icon: '🏛️',
            badge: 'SOA Hub',
            badgeColor: 'bg-blue-100 text-blue-700',
        },
        {
            to: '/dashboard/de-tai',
            label: 'Quản lý Đề tài',
            icon: '📚',
            serviceKey: 'deTai',
            badge: ':5003',
            badgeColor: 'bg-orange-100 text-orange-700',
        },
        {
            to: '/dashboard/sinh-vien',
            label: 'Quản lý Sinh viên',
            icon: '🎓',
            serviceKey: 'sinhVien',
            badge: ':5005',
            badgeColor: 'bg-emerald-100 text-emerald-700',
        },
        {
            to: '/dashboard/giang-vien',
            label: 'Hội đồng Giảng viên',
            icon: '👨‍🏫',
            serviceKey: 'giangVien',
            badge: ':5004',
            badgeColor: 'bg-purple-100 text-purple-700',
        },
        {
            to: '/dashboard/dang-ky',
            label: 'Đăng ký Đồ án',
            icon: '📝',
            serviceKey: 'dangKy',
            badge: ':5002',
            badgeColor: 'bg-rose-100 text-rose-700',
        },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col h-screen shrink-0 border-r border-gray-800">
            {/* Logo */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                        🎓
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">QNU Graduation</h2>
                        <p className="text-[11px] text-gray-400 font-mono">SOA Architecture</p>
                    </div>
                </div>

                {onCloseMobile && (
                    <button
                        onClick={onCloseMobile}
                        className="text-gray-400 hover:text-white lg:hidden p-1"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Các dịch vụ độc lập (SOA)
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                        <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                                item.badgeColor
                            }`}
                        >
                            {item.badge}
                        </span>
                    </NavLink>
                ))}

                {/* Microservice port mapping legend */}
                <div className="pt-6 px-3">
                    <div className="p-3 bg-gray-800/60 rounded-xl border border-gray-700/50">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Cổng dịch vụ Web (HTTP)
                        </div>
                        <div className="space-y-1.5 text-[11px] font-mono">
                            {Object.values(DEFAULT_SERVICE_CONFIG).map((cfg) => (
                                <div key={cfg.key} className="flex justify-between items-center text-gray-300">
                                    <span className="text-gray-400 truncate max-w-[120px]">{cfg.name}:</span>
                                    <span
                                        className="font-bold px-1.5 py-0.2 rounded text-[10px]"
                                        style={{ backgroundColor: `${cfg.color}25`, color: cfg.color }}
                                    >
                                        :{cfg.port}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* User footer & logout */}
            <div className="p-4 border-t border-gray-800 bg-gray-950/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs">
                            A
                        </div>
                        <div className="text-xs">
                            <p className="font-semibold text-gray-200">Giảng viên / SV</p>
                            <p className="text-[10px] text-gray-400 font-mono">Auth: :7001</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Đăng xuất khỏi hệ thống"
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition text-xs font-semibold"
                    >
                        Thoát ↪
                    </button>
                </div>
            </div>
        </aside>
    );
};
