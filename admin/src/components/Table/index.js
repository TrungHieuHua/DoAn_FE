import classNames from 'classnames/bind';

import styles from './Table.module.scss';

const cx = classNames.bind(styles);
function Table({ title, tableTitle, children }) {
    return (
        <div className={cx('wrapper')}>
            <h3>{title}</h3>
            <div className={cx('table')}>
                <div className={cx(classNames)}>{tableTitle}</div>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default Table;
