import classNames from 'classnames/bind';
import { useState } from 'react';

import AuthForm from '~/components/AuthForm';
import styles from './Signup.module.scss';
import FormInput from '~/components/AuthForm/FormInput';

import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { changePassword } from '~/ultils/services/userService';

const cx = classNames.bind(styles);

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSucces, setIsSucces] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const response = await changePassword({
                newPassword: password,
                oldPassword: oldPassword,
                role: 'USER',
            });

            if (response.statusCode === 200) {
                setIsSucces(true);
                setTimeout(() => {
                    window.location.href = routes.profile;
                }, 1000);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('Đổi mật khẩu không thành công');
        }
    };

    return (
        <AuthForm title="Đổi mật khẩu" img="https://shopdunk.com/images/uploaded/banner/TND_M402_010%201.jpeg">
            {isSucces ? (
                <div>Đăng ký thành công</div>
            ) : (
                <>
                    <div className={cx('wrapper')}>
                        <FormInput
                            type="password"
                            label="Mật khẩu cũ: "
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                        />
                        <FormInput
                            type="password"
                            label="Mật khẩu mới: "
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <FormInput
                            type="password"
                            label="Xác nhận mật khẩu mới: "
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            note="Lưu ý: Mật khẩu phải có tối thiểu 8 ký tự bao gồm chữ, số và các ký tự đặc biệt"
                        />
                        {errorMessage && <p className={cx('error')}>{errorMessage}</p>}
                    </div>

                    <div className={cx('btn')}>
                        <Button primary onClick={handleSubmit}>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </>
            )}
        </AuthForm>
    );
}

export default ChangePassword;
