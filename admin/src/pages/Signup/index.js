import { useState } from 'react';
import classNames from 'classnames/bind';

import AuthForm from '~/Layouts/AuthForm';
import InputAuth from '~/components/InputAuth';
import Button from '~/components/Button';
import routes from '~/config/routes';
import { register } from '~/ultils/services/adminService';
import styles from './Signup.module.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    //const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        if (!passwordRegex.test(password)) {
            setError('Mật khẩu có ít nhất 8 ký tự và bao gồm cả chữ và số');
            return;
        }

        try {
            let req = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password,
            };
            const response = await register(req);

            if (response.statusCode === 201) {
                toast.success('Đăng ký thành công!');
                navigate(routes.login);
                return;
            } else {
                toast.error(response.data.message);
                return;
            }
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    return (
        <AuthForm title="Signup" error={error} message={message}>
            <div className={cx('name')}>
                <InputAuth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <InputAuth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <InputAuth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputAuth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputAuth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <InputAuth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className={cx('group_btn')}>
                <Button rounded to={routes.login}>
                    Đăng Nhập
                </Button>
                <Button primary onClick={handleSubmit}>
                    Đăng Kí
                </Button>
            </div>
        </AuthForm>
    );
}

export default Signup;
