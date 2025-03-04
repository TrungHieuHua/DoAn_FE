import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function MenuItem({ icon, name }) {
    let Icon = icon;
    return (
        <div className={cx('menu-item', 'activ')}>
            <div className={cx('icon')}>{Icon && <FontAwesomeIcon icon={Icon} />}</div>
            <span className={cx('name')}>{name}</span>
        </div>
    );
}

export default MenuItem;
