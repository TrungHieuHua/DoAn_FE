import classNames from 'classnames/bind';

import styles from './Footer.module.scss';
import Logo from '../Logo';
import Chatbot from '../../../components/Chatbot/Chatbot';

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
                        <p>Địa chỉ: Số 141 - Chiến Thắng - Văn Quán - Hà Đông - Hà Nội</p>
                    </div>
                </div>
                <div className={cx('intro')}>
                    <h3>Liên hệ</h3>
                    <p>Điện thoại: 0392313572</p>
                    <p>Email: hieuhua7802@gmail.com</p>
                </div>
                <div className={cx('member')}>
                    <h3>Thông báo</h3>
                    <p>Tuyển dụng</p>
                    <p>Gói bảo hành</p>
                </div>
            </div>
            <div className={cx('copyright')}> ©2025 Created by Hua Trung Hieu</div>
            <Chatbot />
        </footer>
    );
}

export default Footer;
