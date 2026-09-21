import React from 'react';

interface OtpProps {
  email: string;
  otp: string; // Đổi thành chuỗi string thuần túy cho dễ quản lý
  setOtp: (val: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const OtpVerificationForm: React.FC<OtpProps> = ({
  email, otp, setOtp, loading, error, onSubmit, onBack
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép nhập số và tối đa 6 ký tự
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(val);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">Xác thực OTP</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Mã xác thực đã được gửi về email <br /><span className="font-semibold text-gray-700">{email}</span>
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Container chứa 6 ô giao diện và 1 input thật nằm ẩn bên trên */}
        <div className="relative flex justify-between gap-2">
          {/* Input thật: nằm trùm lên trên, trong suốt, chịu trách nhiệm nhận phím gõ, tiếng Việt, copy/paste */}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={handleChange}
            autoFocus
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          />

          {/* 6 ô hiển thị giao diện bên dưới */}
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const digit = otp[idx] || '';
            const isActive = otp.length === idx; // Ô đang chuẩn bị nhập
            return (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center text-xl font-bold border rounded-lg transition shadow-sm bg-white ${
                  isActive ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                }`}
              >
                {digit}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:bg-blue-300 text-sm shadow-md"
        >
          {loading ? 'Đang xác thực...' : 'Xác nhận đăng nhập'}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline focus:outline-none font-medium"
        >
          ← Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
};