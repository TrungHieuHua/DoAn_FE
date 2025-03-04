import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import AuthForm from '~/components/AuthForm';
import styles from './Login.module.scss';
import FormInput from '~/components/AuthForm/FormInput';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { forgotPassword, updatePassword } from '~/ultils/services/userService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Trạng thái chờ phản hồi

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const startTimer = () => {
        setIsTimerRunning(true);
        const countdown = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(countdown);
                    setIsTimerRunning(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const handleSubmitOtpRequest = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.warn('Vui lòng nhập email');
            return;
        }

        setIsLoading(true); // Bắt đầu chờ phản hồi
        try {
            const response = await forgotPassword({ email });
            if (response.statusCode === 201) {
                setIsTimerRunning(true);
                setTimer(60);
                setIsOtpSent(true);
                startTimer();
                toast.success('OTP đã được gửi!');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false); // Kết thúc chờ phản hồi
        }
    };

    const validatePassword = (password) => {
        // Password must have at least 8 characters, including letters, numbers, and special characters
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSubmitPasswordReset = async (e) => {
        e.preventDefault();

        if (!otp || !password) {
            toast.warn('Vui lòng nhập đầy đủ OTP và mật khẩu mới');
            return;
        }

        if (!validatePassword(password)) {
            toast.warn('Mật khẩu phải có tối thiểu 8 ký tự bao gồm chữ, số và ký tự đặc biệt');
            return;
        }

        try {
            const response = await updatePassword({ email, otp, password });
            if (response.statusCode === 200) {
                toast.success('Khôi phục mật khẩu thành công!');
                setIsSuccess(true);
                setTimeout(() => {
                    window.location.href = routes.login;
                }, 2000);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <AuthForm title="Quên mật khẩu" img="https://shopdunk.com/images/uploaded/banner/VNU_M492_08%201.jpeg">
            {isSuccess ? (
                <div>Đổi mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập.</div>
            ) : (
                <>
                    {!isOtpSent ? (
                        <>
                            <div className={cx('wrapper')}>
                                <FormInput value={email} onChange={handleEmailChange} type="email" label="Email" />
                            </div>
                            <div className={cx('btn')}>
                                <Button onClick={handleSubmitOtpRequest} primary disabled={isLoading}>
                                    {isLoading ? 'Đang gửi...' : 'Gửi OTP'}
                                </Button>
                            </div>
                            <div>
                                Bạn nhớ mật khẩu?
                                <Link className={cx('link')} to={routes.login}>
                                    Đăng nhập
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={cx('wrapper')}>
                                <FormInput value={otp} onChange={handleOtpChange} type="text" label="Mã OTP" />
                                <FormInput
                                    value={password}
                                    onChange={handlePasswordChange}
                                    type="password"
                                    label="Mật khẩu mới"
                                />
                            </div>
                            {isTimerRunning ? (
                                <div>{timer} giây còn lại để nhập OTP</div>
                            ) : (
                                <div>
                                    <Button onClick={handleSubmitOtpRequest} outline disabled={isLoading}>
                                        {isLoading ? 'Đang gửi...' : 'Lấy OTP mới'}
                                    </Button>
                                </div>
                            )}
                            <div className={cx('btn')}>
                                <Button onClick={handleSubmitPasswordReset} primary>
                                    Cập nhật mật khẩu
                                </Button>
                            </div>
                        </>
                    )}
                </>
            )}
        </AuthForm>
    );
}

export default ForgotPassword;
