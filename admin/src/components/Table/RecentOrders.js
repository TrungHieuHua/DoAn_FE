import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Table.module.scss';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function RecentOrders({ ...props }) {
    return (
        <div className={cx('order')}>
            <p>#{props.id}</p>
            <p>{props.user}</p>
            <p>{props.date}</p>
            <p>{props.status}</p>
            <p className={cx('link')}>
                <Link to={routes.orders}>Detail</Link>
            </p>
        </div>
    );
}

export default RecentOrders;
