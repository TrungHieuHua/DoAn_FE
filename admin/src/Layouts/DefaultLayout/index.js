import classNames from 'classnames/bind';

import styles from './DefaultLayout.module.scss';
import Sidebar from '~/components/Sidebar';
import { isLogin } from '~/ultils/cookie/checkLogin';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const Login = isLogin();
    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            {Login ? (
                <div className={cx('content')}>{children}</div>
            ) : (
                <div className={cx('error')}>
                    <div>
                        <img width={400} src={images.wrong} alt="wrong" />
                    </div>
                    <div className={cx('des')}>
                        Bạn chưa đăng nhập, hoặc phiên đăng nhập đã hết hạn. <br /> Vui lòng{' '}
                        <Link className={cx('link')} to={routes.login}>
                            Đăng nhập
                        </Link>{' '}
                        lại.
                    </div>
                </div>
            )}
        </div>
    );
}

export default DefaultLayout;
