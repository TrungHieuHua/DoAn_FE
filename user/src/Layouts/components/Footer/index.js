import classNames from 'classnames/bind';

import styles from './Footer.module.scss';
import Logo from '../Logo';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer>
            <div className={cx('wrapper')}>
                <div>
                    <div className={'logo'}>
                        <Logo />
                    </div>
                    <div>
                        <p>Địa chỉ: Số 88-Cầu Diễn - Bắc Từ Liêm - Hà Nội</p>
                    </div>
                </div>
                <div className={cx('intro')}>
                    <h3>Liên hệ</h3>
                    <p>Điện thoại: 0382952063</p>
                    <p>Email: vhai31102002@gmail.com</p>
                </div>
                <div className={cx('member')}>
                    <h3>Thông báo</h3>
                    <p>Tuyển dụng</p>
                    <p>Gói bảo hành</p>
                </div>
            </div>
            <div className={cx('copyright')}>ShoesShop ©2024 Created by Nguyen Viet Hai</div>
        </footer>
    );
}

export default Footer;
