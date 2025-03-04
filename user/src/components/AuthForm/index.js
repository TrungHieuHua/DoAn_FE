import classNames from 'classnames/bind';

import styles from './AuthForm.module.scss';

const cx = classNames.bind(styles);

function AuthForm({ title, img, children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('right')}>
                <h3>{title}</h3>
                <div className={cx('children')}>{children}</div>
            </div>
        </div>
    );
}

export default AuthForm;
