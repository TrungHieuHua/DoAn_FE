import Colum from './Colum';
import Row from './Row';
import { v4 } from 'uuid';

import classNames from 'classnames/bind';

import styles from './Table2.module.scss';

const cx = classNames.bind(styles);

function Table2({ colum, rows }) {
    return (
        <table className={cx('wrapper')}>
            <Colum props={colum} />
            {!rows && <div>Không có thông tin</div>}
            <tbody>
                {rows &&
                    rows.map((row) => {
                        return <Row key={v4()} props={row} />;
                    })}
            </tbody>
        </table>
    );
}

export default Table2;
