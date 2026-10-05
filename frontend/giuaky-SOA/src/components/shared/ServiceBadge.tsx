import React from 'react';
import { DEFAULT_SERVICE_CONFIG, getServiceConfig } from '../../config/apiConfig';

interface ServiceBadgeProps {
    serviceKey: 'auth' | 'sinhVien' | 'giangVien' | 'deTai' | 'dangKy';
    isLive?: boolean;
    compact?: boolean;
    onRefresh?: () => void;
}

export const ServiceBadge: React.FC<ServiceBadgeProps> = ({
    serviceKey,
    isLive = false,
    compact = false,
    onRefresh,
}) => {
    const config = DEFAULT_SERVICE_CONFIG[serviceKey];
    if (!config) return null;

    const runtimeConfig = getServiceConfig(serviceKey);

    if (compact) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-gray-300 bg-gray-50 text-gray-800 text-[11px] font-mono">
                <span className="font-bold">{config.name}</span>
                <span className="text-gray-500">(:{config.port})</span>
                <span
                    className={`px-1 py-0.2 text-[10px] font-bold ${
                        isLive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                >
                    {isLive ? 'LIVE' : 'MOCK'}
                </span>
            </span>
        );
    }

    return (
        <div className="border border-gray-300 bg-white p-3 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="px-2 py-1 bg-gray-100 border border-gray-400 font-mono font-bold text-gray-900 text-xs">
                    PORT :{config.port}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{config.name}</span>
                        <span className="text-[11px] text-gray-500">({config.displayName})</span>
                        <span className="px-1.5 py-0.2 bg-gray-100 border border-gray-300 text-gray-600 font-mono text-[10px]">
                            HTTP/REST
                        </span>
                    </div>
                    <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        Base URL: <span className="text-gray-800 font-semibold">{runtimeConfig.baseURL}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 font-mono text-xs">
                    <span className="text-gray-500">Backend:</span>
                    <span
                        className={`px-2 py-0.5 font-bold border ${
                            isLive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                                : 'bg-amber-50 text-amber-800 border-amber-400'
                        }`}
                    >
                        {isLive ? '[ONLINE - LIVE PORT]' : '[OFFLINE - FALLBACK MOCK]'}
                    </span>
                </div>
                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="px-2 py-0.5 border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 font-mono text-xs cursor-pointer"
                        title="Kiểm tra lại kết nối service"
                    >
                        [Ping]
                    </button>
                )}
            </div>
        </div>
    );
};
