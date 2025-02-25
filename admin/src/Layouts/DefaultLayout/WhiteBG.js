import classNames from 'classnames/bind';

import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function WhiteBG({ children, title, className }) {
    return (
        <div className={cx('white_bg', className)}>
            <div className={cx('title')}>{title}</div>
            <div className={cx('children')}>{children}</div>
        </div>
    );
}

export default WhiteBG;
