import classNames from 'classnames/bind';
import { v4 } from 'uuid';

import styles from './Table2.module.scss';

const cx = classNames.bind(styles);

function Row({ props }) {
    const cells = [];

    for (let prop in props) {
        cells.push(<td key={v4()}>{props[prop]}</td>);
    }

    return <tr className={cx('rowx')}>{cells}</tr>;
}

export default Row;
