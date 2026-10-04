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
        <div className="border border-gray-300 bg-white">
            {/* Header Toolbar */}
            <div className="p-3 border-b border-gray-300 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h3>
                    {description && (
                        <p className="text-[11px] text-gray-600 font-mono mt-0.5">{description}</p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="flex items-center border border-gray-300 bg-white">
                        <span className="px-2 py-1 text-gray-500 text-xs font-mono border-r border-gray-200">
                            Tìm:
                        </span>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40 sm:w-56 px-2 py-1 text-xs font-mono focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="px-2 py-1 text-gray-500 hover:text-gray-900 text-xs font-mono cursor-pointer"
                                title="Xóa tìm kiếm"
                            >
                                [X]
                            </button>
                        )}
                    </div>

                    {/* Refresh */}
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            className="px-2.5 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 text-xs font-mono disabled:opacity-50 cursor-pointer"
                            title="Tải lại từ service"
                        >
                            {loading ? '[Đang tải...]' : '[Làm mới]'}
                        </button>
                    )}

                    {extraActions}

                    {/* Add button */}
                    {onAdd && (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="px-3 py-1 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-xs font-mono font-semibold cursor-pointer"
                        >
                            [+ Thêm mới]
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-mono text-[11px] uppercase border-b border-gray-300">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-3 py-2 border-r border-gray-200 last:border-r-0 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-3 py-2 text-right">Thao tác</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-sans">
                        {loading && data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="p-8 text-center text-gray-500 font-mono text-xs"
                                >
                                    [REST API] Đang kết nối tới microservice...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="p-8 text-center text-gray-500 font-mono text-xs"
                                >
                                    {searchQuery ? '[Không tìm thấy bản ghi phù hợp]' : '[Chưa có dữ liệu nào]'}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => {
                                const rowId = String(item[idKey]);
                                return (
                                    <tr key={rowId} className="hover:bg-gray-50 transition-colors">
                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx} className={`px-3 py-2 text-gray-800 border-r border-gray-100 last:border-r-0 ${col.className || ''}`}>
                                                {col.render
                                                    ? col.render(item)
                                                    : col.key
                                                    ? String(item[col.key as keyof T] ?? '')
                                                    : null}
                                            </td>
                                        ))}

                                        {(onEdit || onDelete) && (
                                            <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap font-mono text-xs">
                                                {onEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(item)}
                                                        className="px-1.5 py-0.5 border border-gray-300 hover:border-gray-500 text-gray-700 bg-white cursor-pointer"
                                                    >
                                                        [Sửa]
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(item)}
                                                        className="px-1.5 py-0.5 border border-rose-300 hover:border-rose-500 text-rose-700 bg-rose-50 cursor-pointer"
                                                    >
                                                        [Xóa]
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
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-300 flex items-center justify-between text-xs text-gray-600 font-mono">
                <span>
                    Bản ghi: <strong>{filteredData.length}</strong> / {data.length}
                </span>
                <span className="text-[11px] text-gray-500">
                    Giao thức: HTTP/REST JSON
                </span>
            </div>
        </div>
    );
}
