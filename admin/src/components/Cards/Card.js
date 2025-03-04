import classNames from 'classnames/bind';
import styles from './Cards.module.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(styles);

function Card({ ...props }) {
    let color = props.color;
    return (
        <div
            className={cx('card-item')}
            style={{
                background: color.backgroundColor,
                boxShadow: color.boxShadow,
            }}
        >
            <div className={cx('radialBar')}>
                <CircularProgressbar value={props.barValue} text={props.barValue + '%'} />
                <p>{props.title}</p>
            </div>
            <div className={cx('detail')}>
                <FontAwesomeIcon className={cx('icon')} icon={props.img} />
                <span>{props.value}</span>
                <span>Last 24 hours</span>
            </div>
        </div>
    );
}

export default Card;
