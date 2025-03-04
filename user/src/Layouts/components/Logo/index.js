import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Logo.module.scss';
import routes from '~/config/routes';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Logo() {
    return (
        <div className={cx('wrapper')}>
            <Link className={cx('wrapper')} to={routes.home}>
                <h1 className={cx('logo_text')}>
                    <p>Shoes</p>
                    <p>Shop</p>
                </h1>
            </Link>
        </div>
    );
}

export default Logo;
