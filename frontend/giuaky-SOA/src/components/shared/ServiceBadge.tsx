import React from 'react';
import { DEFAULT_SERVICE_CONFIG } from '../../config/apiConfig';

interface ServiceBadgeProps {
    serviceKey: 'auth' | 'sinhVien' | 'giangVien' | 'deTai' | 'dangKy';
    isLive?: boolean;
    compact?: boolean;
}

export const ServiceBadge: React.FC<ServiceBadgeProps> = ({
    serviceKey,
    isLive = false,
    compact = false,
}) => {
    const config = DEFAULT_SERVICE_CONFIG[serviceKey];
    if (!config) return null;

    if (compact) {
        return (
            <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                    backgroundColor: `${config.color}15`,
                    color: config.color,
                    border: `1px solid ${config.color}40`,
                }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                />
                {config.name} (:{config.port})
            </span>
        );
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs"
                    style={{ backgroundColor: config.color }}
                >
                    :{config.port.toString().slice(-2)}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{config.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                            Port {config.port}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-medium">
                            REST / HTTP
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                {isLive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Backend Online
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium" title="Sử dụng dữ liệu Mock khi chưa bật Service">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Mock Fallback
                    </span>
                )}
            </div>
        </div>
    );
};
