import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Table.module.scss';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function TopProducts({ ...props }) {
    return (
        <div
            className={cx('order')}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <p
                style={{
                    width: '100px',
                }}
            >
                {props.index}
            </p>
            <p
                style={{
                    flex: 1,
                }}
            >
                {props.productName}
            </p>
            <p
                style={{
                    width: '140px',
                }}
            >
                {props.totalQuantitySold}
            </p>
        </div>
    );
}

export default TopProducts;
