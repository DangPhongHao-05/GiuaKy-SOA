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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-blue-600 tracking-tight">🎓 QNU Graduation Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Hệ thống đăng ký đồ án tốt nghiệp sinh viên</p>
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