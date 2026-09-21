import React from "react";
import { Link } from "react-router-dom";

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
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">
        Đăng ký tài khoản
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Hệ thống Đăng ký Đồ án Tốt nghiệp
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 text-center border border-green-200">
          {successMsg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            placeholder="vd: Đặng Phong Hào"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
        </div>

        {/*Thêm ô Xác nhận mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:bg-blue-300 text-sm shadow-md"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
