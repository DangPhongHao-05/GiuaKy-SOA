export interface ApiLogEntry {
    id: string;
    timestamp: string;
    serviceName: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    requestBody?: unknown;
    status: 'pending' | 'success' | 'error' | 'mock';
    statusCode?: number;
    responseTimeMs?: number;
    responseBody?: unknown;
    errorMessage?: string;
    isMock?: boolean;
}

type LogListener = (logs: ApiLogEntry[]) => void;

class ApiLoggerService {
    private logs: ApiLogEntry[] = [];
    private listeners: Set<LogListener> = new Set();
    private maxLogs = 50;

    public subscribe(listener: LogListener): () => void {
        this.listeners.add(listener);
        listener([...this.logs]);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify() {
        const copy = [...this.logs];
        this.listeners.forEach(fn => fn(copy));
    }

    public startCall(entry: Omit<ApiLogEntry, 'id' | 'timestamp' | 'status'>): string {
        const id = Math.random().toString(36).substring(2, 9);
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');

        const newEntry: ApiLogEntry = {
            ...entry,
            id,
            timestamp: timeStr,
            status: 'pending',
        };

        this.logs.unshift(newEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
        this.notify();
        return id;
    }

    public completeCall(
        id: string,
        result: {
            statusCode?: number;
            responseTimeMs?: number;
            responseBody?: unknown;
            errorMessage?: string;
            isMock?: boolean;
            status: 'success' | 'error' | 'mock';
        }
    ) {
        const item = this.logs.find(log => log.id === id);
        if (item) {
            Object.assign(item, result);
            this.notify();
        }
    }

    public addMockCall(entry: {
        serviceName: string;
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        url: string;
        requestBody?: unknown;
        responseBody?: unknown;
        note?: string;
    }) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');

        const log: ApiLogEntry = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: timeStr,
            serviceName: entry.serviceName,
            method: entry.method,
            url: entry.url,
            requestBody: entry.requestBody,
            status: 'mock',
            statusCode: 200,
            responseTimeMs: Math.floor(Math.random() * 40) + 10,
            responseBody: entry.responseBody,
            errorMessage: entry.note || 'Dịch vụ chưa sẵn sàng -> Phản hồi dữ liệu Mock cục bộ',
            isMock: true,
        };

        this.logs.unshift(log);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
        this.notify();
    }

    public clearLogs() {
        this.logs = [];
        this.notify();
    }

    public getLogs(): ApiLogEntry[] {
        return [...this.logs];
    }
}

export const apiLogger = new ApiLoggerService();
