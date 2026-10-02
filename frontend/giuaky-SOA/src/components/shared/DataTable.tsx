import React, { useState } from 'react';

export interface ColumnDef<T> {
    header: string;
    key?: keyof T | string;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    idKey: keyof T;
    title: string;
    description?: string;
    onAdd?: () => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onRefresh?: () => void;
    loading?: boolean;
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    extraActions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    idKey,
    title,
    description,
    onAdd,
    onEdit,
    onDelete,
    onRefresh,
    loading = false,
    searchPlaceholder = 'Tìm kiếm dữ liệu...',
    searchKeys = [],
    extraActions,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = data.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        if (searchKeys.length > 0) {
            return searchKeys.some((k) => {
                const val = item[k];
                return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
            });
        }
        return Object.values(item).some((val) => {
            return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
        });
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Toolbar */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                        <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Refresh */}
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            className="p-1.5 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition disabled:opacity-50 text-xs flex items-center gap-1 font-medium px-2.5"
                            title="Tải lại từ service"
                        >
                            <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
                            Làm mới
                        </button>
                    )}

                    {extraActions}

                    {/* Add button */}
                    {onAdd && (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                            <span>+</span>
                            Thêm mới
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-5 py-3 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-5 py-3 text-right">Thao tác</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="p-10 text-center text-gray-400 text-sm"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span>Đang kết nối & tải dữ liệu qua REST API...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="p-10 text-center text-gray-400 text-sm"
                                >
                                    {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có bản ghi nào'}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => {
                                const rowId = String(item[idKey]);
                                return (
                                    <tr key={rowId} className="hover:bg-blue-50/30 transition-colors">
                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx} className={`px-5 py-3.5 text-xs text-gray-700 ${col.className || ''}`}>
                                                {col.render
                                                    ? col.render(item)
                                                    : col.key
                                                    ? String(item[col.key as keyof T] ?? '')
                                                    : null}
                                            </td>
                                        ))}

                                        {(onEdit || onDelete) && (
                                            <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                                                {onEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(item)}
                                                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                                                    >
                                                        Sửa
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(item)}
                                                        className="px-2 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                    Hiển thị <strong className="text-gray-700">{filteredData.length}</strong> / {data.length} bản ghi
                </span>
                <span className="font-mono text-[11px] text-gray-400">
                    HTTP/REST Payload Cache
                </span>
            </div>
        </div>
    );
}
