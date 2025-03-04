import classNames from 'classnames/bind';

import styles from './Table2.module.scss';

const cx = classNames.bind(styles);

function Row({ props }) {
    return (
        <thead>
            <tr className={cx('col')}>
                {props.map((column, index) => (
                    <th key={index} style={{ width: column.width }}>
                        {column.field}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export default Row;
