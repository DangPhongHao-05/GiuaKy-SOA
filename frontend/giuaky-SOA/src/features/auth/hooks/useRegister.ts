import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

export const useRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword || !fullName) {
            setError('Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        // Kiểm tra mật khẩu khớp nhau không
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await authApi.register({ email, password, fullName });
            setSuccessMsg(res.message || 'Đăng ký tài khoản thành công! Đang chuyển hướng...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err: any) {
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        fullName,
        setFullName,
        loading,
        error,
        successMsg,
        handleRegister,
    };
};
