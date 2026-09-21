import React from "react";
import { useRegister } from "../hooks/useRegister";
import { RegisterForm } from "../components/RegisterForm";

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-blue-600 tracking-tight">
          🎓 QNU Graduation Portal
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Đăng ký tài khoản hệ thống đồ án tốt nghiệp
        </p>
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
