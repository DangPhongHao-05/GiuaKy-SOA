import React from 'react';
import { Link } from 'react-router-dom';

interface RegisterProps {
    fullName: string;
    setFullName: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    confirmPassword: string;
    setConfirmPassword: (val: string) => void;
    loading: boolean;
    error: string;
    successMsg: string;
    onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterProps> = ({
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    successMsg,
    onSubmit,
}) => {
    return (
        <div className="bg-white p-5 border-2 border-gray-800 w-full max-w-md font-mono text-xs shadow-sm">
            <div className="pb-3 mb-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase">
                    Tạo tài khoản thử nghiệm
                </h3>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    Gửi yêu cầu POST tới endpoint <code className="text-gray-800">/api/Auth/register</code>
                </p>
            </div>

            {error && (
                <div className="p-2 border border-rose-300 bg-rose-50 text-rose-700 text-xs mb-3">
                    [LỖI]: {error}
                </div>
            )}

            {successMsg && (
                <div className="p-2 border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs mb-3">
                    [THÀNH CÔNG]: {successMsg}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block font-bold text-gray-700 mb-1">
                        Họ và tên
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Ví dụ: Đặng Phong Hào"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block font-bold text-gray-700 mb-1">
                        Địa chỉ Email
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

                <div>
                    <label className="block font-bold text-gray-700 mb-1">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs font-mono focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white font-bold transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? '[Đang gửi request...]' : '[Gửi yêu cầu đăng ký]'}
                </button>
            </form>

            <div className="text-center mt-3 pt-3 border-t border-gray-200 font-sans">
                <p className="text-[11px] text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link to="/" className="font-mono font-bold text-gray-900 underline hover:text-blue-700">
                        [Đăng nhập ngay]
                    </Link>
                </p>
            </div>
        </div>
    );
};
