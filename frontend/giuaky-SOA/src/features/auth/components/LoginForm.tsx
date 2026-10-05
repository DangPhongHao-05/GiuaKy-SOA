import React from 'react';
import { Link } from 'react-router-dom';

interface LoginFormProps {
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    loading: boolean;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    onSubmit,
}) => {
    return (
        <div className="bg-white p-5 border-2 border-gray-800 w-full max-w-md font-mono text-xs shadow-sm">
            <div className="pb-3 mb-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase">
                    Thông tin đăng nhập
                </h3>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    Gửi yêu cầu POST tới endpoint <code className="text-gray-800">/api/Auth/login</code>
                </p>
            </div>

            {error && (
                <div className="p-2 border border-rose-300 bg-rose-50 text-rose-700 text-xs mb-3">
                    [LỖI]: {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block font-bold text-gray-700 mb-1">
                        Email sinh viên / giảng viên
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="sv12345@qnu.edu.vn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block font-bold text-gray-700 mb-1">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white font-bold transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? '[Đang gửi request...]' : '[Tiếp tục -> Xác thực OTP]'}
                </button>
            </form>

            {/* Quick Test Links */}
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2 text-center font-sans">
                <div className="text-[11px] text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link
                        to="/register"
                        className="font-mono font-bold text-gray-900 underline hover:text-blue-700"
                    >
                        [Đăng ký ngay]
                    </Link>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-200">
                    <Link
                        to="/dashboard"
                        className="text-[11px] font-mono text-gray-500 hover:text-gray-900 underline"
                    >
                        [Bỏ qua đăng nhập, vào thẳng SOA Dashboard để test]
                    </Link>
                </div>
            </div>
        </div>
    );
};
