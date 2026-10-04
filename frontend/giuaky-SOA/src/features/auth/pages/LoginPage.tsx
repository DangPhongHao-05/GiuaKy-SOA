import React from 'react';
import { useLogin } from '../hooks/useLogin';
import { LoginForm } from '../components/LoginForm';
import { OtpVerificationForm } from '../components/OtpVerification';

export const LoginPage: React.FC = () => {
    const {
        step,
        setStep,
        email,
        setEmail,
        password,
        setPassword,
        otp,
        setOtp,
        loading,
        error,
        handleLogin,
        handleVerifyOtp,
    } = useLogin();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-mono">
            <div className="mb-4 text-center max-w-md w-full">
                <div className="text-xs text-gray-500 uppercase tracking-widest">
                    Kiến trúc Hướng Dịch vụ (SOA)
                </div>
                <h1 className="text-base font-bold text-gray-900 mt-1">
                    [AuthService :7001] ĐĂNG NHẬP HỆ THỐNG
                </h1>
                <div className="mt-1 text-[11px] text-gray-500 font-sans">
                    Kiểm thử xác thực 2 lớp qua Email OTP & JWT Token
                </div>
            </div>

            {step === 'LOGIN' ? (
                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    loading={loading}
                    error={error}
                    onSubmit={handleLogin}
                />
            ) : (
                <OtpVerificationForm
                    email={email}
                    otp={otp}
                    setOtp={setOtp}
                    loading={loading}
                    error={error}
                    onSubmit={handleVerifyOtp}
                    onBack={() => setStep('LOGIN')}
                />
            )}
        </div>
    );
};

export default LoginPage;