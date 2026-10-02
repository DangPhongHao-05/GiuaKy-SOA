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

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'POST':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'PUT':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'DELETE':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusBadge = (log: ApiLogEntry) => {
        if (log.status === 'pending') {
            return (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    SENDING...
                </span>
            );
        }
        if (log.isMock) {
            return (
                <span className="inline-flex items-center text-xs font-mono font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    200 (MOCK)
                </span>
            );
        }
        if (log.status === 'success') {
            return (
                <span className="inline-flex items-center text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {log.statusCode || 200} OK
                </span>
            );
        }
        return (
            <span className="inline-flex items-center text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {log.statusCode || 'ERR'}
            </span>
        );
    };

    return (
        <>
            {/* Nút bấm nổi ở góc dưới để bật / tắt bảng Log API SOA */}
            <div className="fixed bottom-4 right-4 z-40">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg border border-gray-700 transition font-medium text-xs sm:text-sm"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>SOA REST Logs</span>
                    <span className="bg-gray-700 text-gray-200 text-xs px-1.5 py-0.2 rounded-full font-mono">
                        {logs.length}
                    </span>
                    <span className="text-gray-400">{isOpen ? '▼' : '▲'}</span>
                </button>
            </div>

            {/* Panel bảng log */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 w-[92vw] sm:w-[650px] max-h-[550px] bg-gray-950 text-gray-100 rounded-2xl shadow-2xl border border-gray-800 flex flex-col z-50 overflow-hidden font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-wide">
                                📡 Giám sát HTTP / REST Microservices
                            </span>
                            <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded">
                                Realtime SOA
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => apiLogger.clearLogs()}
                                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded transition"
                                title="Xóa lịch sử log"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Filter bar */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 border-b border-gray-800/80 text-xs">
                        <span className="text-gray-400">Lọc dịch vụ:</span>
                        {['all', 'Auth', 'DeTai', 'SinhVien', 'GiangVien', 'DangKy'].map((svc) => (
                            <button
                                key={svc}
                                onClick={() => setFilterService(svc)}
                                className={`px-2 py-1 rounded transition text-xs font-mono ${
                                    filterService === svc
                                        ? 'bg-blue-600 text-white font-medium'
                                        : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {svc}
                            </button>
                        ))}
                    </div>

                    {/* Danh sách log */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60 max-h-[300px]">
                        {filteredLogs.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-xs">
                                Chưa có request HTTP/REST nào được gửi. Hãy thao tác trên các màn hình để quan sát các lệnh gọi API qua mạng.
                            </div>
                        ) : (
                            filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className={`px-4 py-2.5 hover:bg-gray-900/80 cursor-pointer transition flex items-center justify-between text-xs font-mono gap-2 ${
                                        selectedLog?.id === log.id ? 'bg-blue-950/40 border-l-2 border-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-gray-500 text-[11px]">{log.timestamp}</span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${getMethodColor(
                                                log.method
                                            )}`}
                                        >
                                            {log.method}
                                        </span>
                                        <span className="text-gray-300 font-semibold truncate max-w-[240px]" title={log.url}>
                                            {log.url}
                                        </span>
                                        <span className="text-[10px] text-gray-400 px-1.5 py-0.5 rounded bg-gray-800">
                                            {log.serviceName}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {log.responseTimeMs !== undefined && (
                                            <span className="text-[11px] text-gray-400">
                                                {log.responseTimeMs}ms
                                            </span>
                                        )}
                                        {getStatusBadge(log)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Chi tiết request / response đã chọn */}
                    {selectedLog && (
                        <div className="p-3 bg-gray-900 border-t border-gray-800 text-xs max-h-[180px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-1 text-gray-400 font-mono text-[11px]">
                                <span>
                                    CHI TIẾT: {selectedLog.method} {selectedLog.url} ({selectedLog.serviceName})
                                </span>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Đóng
                                </button>
                            </div>

                            {Boolean(selectedLog.requestBody) && (
                                <div className="mb-2">
                                    <div className="text-[11px] font-semibold text-gray-400 mb-0.5">Request Body:</div>
                                    <pre className="bg-black/60 p-2 rounded text-emerald-400 font-mono text-[11px] overflow-x-auto">
                                        {JSON.stringify(selectedLog.requestBody, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div>
                                <div className="text-[11px] font-semibold text-gray-400 mb-0.5">Response:</div>
                                <pre className="bg-black/60 p-2 rounded text-blue-300 font-mono text-[11px] overflow-x-auto">
                                    {selectedLog.responseBody
                                        ? JSON.stringify(selectedLog.responseBody, null, 2)
                                        : selectedLog.errorMessage || '(Không có nội dung)'}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
