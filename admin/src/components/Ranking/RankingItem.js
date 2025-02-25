import classNames from 'classnames/bind';

import styles from './Ranking.module.scss';

const cx = classNames.bind(styles);

function RankingItem({ ...props }) {
    return (
        <div className={cx('item')}>
            <p data-content={props.top}></p>
            <p>{props.user}</p>
            <p>{props.price}</p>
        </div>
    );
}

export default RankingItem;
