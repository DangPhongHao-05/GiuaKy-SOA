import React from "react";
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
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">
        Đăng nhập
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Cổng thông tin Đăng ký Đồ án Tốt nghiệp
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email sinh viên
          </label>
          <input
            type="email"
            placeholder="vd: sv12345@qnu.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 thẻ-vien rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:bg-blue-300 text-sm shadow-md"
        >
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </form>

      {/* Thêm phần điều hướng sang trang đăng ký */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
