import classNames from 'classnames/bind';
import { useState } from 'react';

import AuthForm from '~/components/AuthForm';
import styles from './Signup.module.scss';
import FormInput from '~/components/AuthForm/FormInput';

import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { register } from '~/ultils/services/userService';

const cx = classNames.bind(styles);

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSucces, setIsSucces] = useState(false);

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng ký');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu không khớp');
            return;
        }

        if (!passwordRegex.test(password)) {
            setErrorMessage('Mật khẩu phải có tối thiểu 8 ký tự bao gồm chữ, số và các ký tự đặc biệt');
            return;
        }

        try {
            const response = await register({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password,
            });

            if (response.statusCode === 201) {
                setIsSucces(true);
                setTimeout(() => {
                    window.location.href = routes.login;
                }, 1000);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('Đăng ký không thành công');
        }
    };

    return (
        <AuthForm title="Đăng Ký" img="https://shopdunk.com/images/uploaded/banner/TND_M402_010%201.jpeg">
            {isSucces ? (
                <div>Đăng ký thành công</div>
            ) : (
                <>
                    <div className={cx('wrapper')}>
                        <div className={cx('form')}>
                            <FormInput type="text" label="Tên: " value={firstName} onChange={handleFirstNameChange} />
                            <FormInput type="text" label="Họ: " value={lastName} onChange={handleLastNameChange} />
                        </div>
                        <div className={cx('form')}>
                            <FormInput type="text" label="Email: " value={email} onChange={handleEmailChange} />
                        </div>
                        <FormInput type="text" label="Username" value={username} onChange={handleUsernameChange} />
                        <FormInput
                            type="password"
                            label="Mật khẩu: "
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <FormInput
                            type="password"
                            label="Xác nhận mật khẩu: "
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            note="Lưu ý: Mật khẩu phải có tối thiểu 8 ký tự bao gồm chữ, số và các ký tự đặc biệt"
                        />
                        {errorMessage && <p className={cx('error')}>{errorMessage}</p>}
                    </div>

                    <div className={cx('btn')}>
                        <Button primary onClick={handleSubmit}>
                            Đăng ký
                        </Button>
                    </div>
                    <div>
                        Bạn đã có tài khoản?
                        <Link className={cx('link')} to={routes.login}>
                            Đăng nhập ngay.
                        </Link>
                    </div>
                </>
            )}
        </AuthForm>
    );
}

export default Signup;
