import { useState } from 'react';
import { authApi } from '../api';
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const navigate = useNavigate();

  // 1. Gửi request đăng nhập (Bước 1) -> Server gửi OTP về email
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
    
      if (res.requireOtp || res.success) {
        setStep('OTP');
      }
    } catch (err: any) {
      // Lấy thông báo lỗi từ Backend (Axios error)
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Gửi request xác thực OTP (Bước 2) -> Gọi API thật
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.verifyOtp(email, otp);

      if (res.token || res.success) {
        // Lưu token thật do Backend trả về
        localStorage.setItem('accessToken', res.token || res.accessToken);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};