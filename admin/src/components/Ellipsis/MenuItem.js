import classNames from 'classnames/bind';
import styles from './Ellipsis.module.scss';

const cx = classNames.bind(styles);
function MenuItem({ menu }) {
    return (
        <div onClick={menu.onClick} className={cx('menu-item')}>
            {menu.title}
        </div>
    );
}

export default MenuItem;
