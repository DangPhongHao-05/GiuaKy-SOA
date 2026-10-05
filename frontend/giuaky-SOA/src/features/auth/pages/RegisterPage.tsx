import React from 'react';
import { useRegister } from '../hooks/useRegister';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
    const {
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
        handleRegister,
    } = useRegister();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-mono">
            <div className="mb-4 text-center max-w-md w-full">
                <div className="text-xs text-gray-500 uppercase tracking-widest">
                    Kiến trúc Hướng Dịch vụ (SOA)
                </div>
                <h1 className="text-base font-bold text-gray-900 mt-1">
                    [AuthService :7001] ĐĂNG KÝ TÀI KHOẢN MỚI
                </h1>
                <div className="mt-1 text-[11px] text-gray-500 font-sans">
                    Kiểm thử tạo tài khoản & mã hóa mật khẩu phía Backend
                </div>
            </div>

            <RegisterForm
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                loading={loading}
                error={error}
                successMsg={successMsg}
                onSubmit={handleRegister}
            />
        </div>
    );
};

export default RegisterPage;
