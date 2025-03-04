import React from 'react';
import classNames from 'classnames/bind';
import styles from './ModalLoading.module.scss'; // Bạn có thể tạo file riêng cho modal này nếu muốn

const cx = classNames.bind(styles);

function ModalLoading({ show }) {
    if (!show) return null;

    return (
        <div className={cx('overlay')}>
            <div className={cx('modal')}>
                <div className={cx('loading')}>
                    <span>Đang xử lý...</span>
                </div>
            </div>
        </div>
    );
}

export default ModalLoading;
