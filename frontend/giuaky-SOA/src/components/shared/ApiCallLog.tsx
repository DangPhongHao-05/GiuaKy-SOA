import React, { useState, useEffect } from 'react';
import { apiLogger, type ApiLogEntry } from '../../services/apiLogger';

export const ApiCallLog: React.FC = () => {
    const [logs, setLogs] = useState<ApiLogEntry[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(null);
    const [filterService, setFilterService] = useState<string>('all');

    useEffect(() => {
        const unsubscribe = apiLogger.subscribe((newLogs) => {
            setLogs(newLogs);
            if (selectedLog) {
                const updated = newLogs.find((l) => l.id === selectedLog.id);
                if (updated) setSelectedLog(updated);
            }
        });
        return unsubscribe;
    }, [selectedLog]);

    const filteredLogs = logs.filter((log) => {
        if (filterService === 'all') return true;
        return log.serviceName.toLowerCase().includes(filterService.toLowerCase());
    });

    const getMethodBadge = (method: string) => {
        switch (method) {
            case 'GET':
                return 'text-blue-400 border border-blue-500/40 bg-blue-950/40';
            case 'POST':
                return 'text-emerald-400 border border-emerald-500/40 bg-emerald-950/40';
            case 'PUT':
                return 'text-amber-400 border border-amber-500/40 bg-amber-950/40';
            case 'DELETE':
                return 'text-rose-400 border border-rose-500/40 bg-rose-950/40';
            default:
                return 'text-gray-300 border border-gray-600 bg-gray-800';
        }
    };

    const getStatusBadge = (log: ApiLogEntry) => {
        if (log.status === 'pending') {
            return (
                <span className="text-[11px] font-mono text-amber-300 border border-amber-500/50 px-1.5 py-0.2">
                    SENDING...
                </span>
            );
        }
        if (log.isMock) {
            return (
                <span className="text-[11px] font-mono text-amber-400 border border-amber-500/40 bg-amber-950/30 px-1.5 py-0.2">
                    MOCK (200)
                </span>
            );
        }
        if (log.status === 'success') {
            return (
                <span className="text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/50 bg-emerald-950/30 px-1.5 py-0.2">
                    {log.statusCode || 200} OK
                </span>
            );
        }
        return (
            <span className="text-[11px] font-mono font-bold text-rose-400 border border-rose-500/50 bg-rose-950/30 px-1.5 py-0.2">
                {log.statusCode || 'ERR'}
            </span>
        );
    };

    return (
        <>
            {/* Toggle button text-only ở góc dưới bên phải */}
            <div className="fixed bottom-3 right-3 z-40">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-3 py-1.5 bg-gray-900 hover:bg-black text-gray-200 border-2 border-gray-600 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                    <span className="w-2 h-2 bg-emerald-400 inline-block" />
                    <span>REST API LOGS [{logs.length}]</span>
                    <span>{isOpen ? '[-]' : '[+]'}</span>
                </button>
            </div>

            {/* Console Panel Wireframe */}
            {isOpen && (
                <div className="fixed bottom-12 right-3 w-[95vw] sm:w-[720px] max-h-[560px] bg-gray-950 text-gray-200 border-2 border-gray-600 flex flex-col z-50 font-mono text-xs shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-100">
                                [DEV CONSOLE: HTTP / REST MONITOR]
                            </span>
                            <span className="text-[10px] text-gray-400">
                                (5 Services SOA)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => apiLogger.clearLogs()}
                                className="px-2 py-0.5 border border-gray-600 hover:bg-gray-800 text-gray-300 text-[11px] cursor-pointer"
                            >
                                [Xóa logs]
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-2 py-0.5 border border-gray-600 hover:bg-gray-800 text-gray-300 text-[11px] cursor-pointer font-bold"
                            >
                                [Đóng]
                            </button>
                        </div>
                    </div>

                    {/* Filter bar */}
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-900/60 border-b border-gray-800 text-[11px] overflow-x-auto">
                        <span className="text-gray-400 mr-1">Lọc:</span>
                        {['all', 'Auth', 'DeTai', 'SinhVien', 'GiangVien', 'DangKy'].map((svc) => (
                            <button
                                key={svc}
                                type="button"
                                onClick={() => setFilterService(svc)}
                                className={`px-2 py-0.5 border text-[11px] cursor-pointer ${
                                    filterService === svc
                                        ? 'bg-gray-200 text-black border-white font-bold'
                                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                                }`}
                            >
                                [{svc}]
                            </button>
                        ))}
                    </div>

                    {/* Danh sách log */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-800 max-h-[260px] bg-black/40">
                        {filteredLogs.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-xs">
                                [Chưa có HTTP Request nào được ghi nhận. Thao tác trên giao diện để xem các lời gọi API]
                            </div>
                        ) : (
                            filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className={`px-3 py-1.5 hover:bg-gray-800/80 cursor-pointer flex items-center justify-between gap-2 ${
                                        selectedLog?.id === log.id ? 'bg-gray-800 border-l-4 border-emerald-400' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-gray-500 text-[10px]">{log.timestamp}</span>
                                        <span className={`px-1.5 py-0.2 text-[10px] font-bold ${getMethodBadge(log.method)}`}>
                                            {log.method}
                                        </span>
                                        <span className="text-gray-300 font-semibold truncate max-w-[280px]" title={log.url}>
                                            {log.url}
                                        </span>
                                        <span className="text-[10px] text-gray-400 px-1 border border-gray-700 bg-gray-900">
                                            {log.serviceName}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {log.responseTimeMs !== undefined && (
                                            <span className="text-[10px] text-gray-400">
                                                {log.responseTimeMs}ms
                                            </span>
                                        )}
                                        {getStatusBadge(log)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Chi tiết log được chọn */}
                    {selectedLog && (
                        <div className="p-3 bg-gray-900 border-t border-gray-700 text-xs max-h-[200px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-1.5 text-gray-400 text-[11px] pb-1 border-b border-gray-800">
                                <span className="font-bold text-gray-200">
                                    INSPECTOR: {selectedLog.method} {selectedLog.url} ({selectedLog.serviceName})
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedLog(null)}
                                    className="text-gray-400 hover:text-white cursor-pointer"
                                >
                                    [Thu nhỏ]
                                </button>
                            </div>

                            {Boolean(selectedLog.requestBody) && (
                                <div className="mb-2">
                                    <div className="text-[10px] font-bold text-gray-400 mb-0.5">REQUEST PAYLOAD:</div>
                                    <pre className="bg-black p-2 border border-gray-800 text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
                                        {JSON.stringify(selectedLog.requestBody, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div>
                                <div className="text-[10px] font-bold text-gray-400 mb-0.5">RESPONSE BODY:</div>
                                <pre className="bg-black p-2 border border-gray-800 text-blue-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                                    {selectedLog.responseBody
                                        ? JSON.stringify(selectedLog.responseBody, null, 2)
                                        : selectedLog.errorMessage || '(Rỗng)'}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
