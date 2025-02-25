import classNames from 'classnames/bind';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '~/Layouts/AuthForm';
import styles from './Login.module.scss';
import InputAuth from '~/components/InputAuth';
import Button from '~/components/Button';
import routes from '~/config/routes';
import { login } from '~/ultils/services/adminService';
import { deleteCookie, setCookie } from '~/ultils/cookie';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        deleteCookie('accessToken');

        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            let req = {
                username: username,
                password: password,
            };
            const response = await login(req);
            if (response.data.role === '[USER]') {
                toast.error('Tài khoản của bạn không có quyền truy cập trang quản trị!');
                return;
            }
            if (response.statusCode === 200) {
                toast.success('Đăng nhập thành công');
                setCookie('accessToken', response.data.accessToken);
                navigate(routes.home);
                return;
            } else {
                if (response.data.message === 'Bad credentials') {
                    toast.error('Tài khoản hoặc mật khẩu không chính xác!');
                } else {
                    toast.error(response.data.message);
                }

                return;
            }

            // Xử lý phản hồi từ server sau khi đăng ký thành công
        } catch (error) {
            toast.error(error.data.message);
        }

        // Xử lý đăng nhập
    };

    return (
        <AuthForm title="Login" error={error} message={message}>
            <InputAuth label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
            <InputAuth
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <div className={cx('group_btn')}>
                <Button primary onClick={handleSubmit}>
                    Đăng Nhập
                </Button>
            </div>
        </AuthForm>
    );
}

export default Login;
