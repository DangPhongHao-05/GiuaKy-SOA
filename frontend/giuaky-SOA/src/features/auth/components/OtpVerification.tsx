import React from 'react';

interface OtpProps {
    email: string;
    otp: string;
    setOtp: (val: string) => void;
    loading: boolean;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export const OtpVerificationForm: React.FC<OtpProps> = ({
    email,
    otp,
    setOtp,
    loading,
    error,
    onSubmit,
    onBack,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(val);
    };

    return (
        <div className="bg-white p-5 border-2 border-gray-800 w-full max-w-md font-mono text-xs shadow-sm">
            <div className="pb-3 mb-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase">
                    Xác thực mã OTP 2 lớp
                </h3>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                    Mã xác thực đã được gửi về email:{' '}
                    <span className="font-mono font-bold text-gray-800">{email}</span>
                </p>
            </div>

            {error && (
                <div className="p-2 border border-rose-300 bg-rose-50 text-rose-700 text-xs mb-3">
                    [LỖI]: {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="relative flex justify-between gap-2 py-2">
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

                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const digit = otp[idx] || '';
                        const isActive = otp.length === idx;
                        return (
                            <div
                                key={idx}
                                className={`w-11 h-12 flex items-center justify-center text-lg font-bold border-2 transition ${
                                    isActive
                                        ? 'border-black bg-white ring-1 ring-black'
                                        : 'border-gray-300 bg-gray-50 text-gray-800'
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
                    className="w-full py-2 border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white font-bold transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? '[Đang xác thực...]' : '[Xác nhận OTP -> Vào hệ thống]'}
                </button>
            </form>

            <div className="text-center mt-3 pt-3 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onBack}
                    className="font-mono text-xs text-gray-600 hover:text-black underline cursor-pointer"
                >
                    [← Quay lại bước đăng nhập]
                </button>
            </div>
        </div>
    );
};