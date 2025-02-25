import classNames from 'classnames/bind';

import styles from './ArticlesIntro.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Item({ props }) {
    return (
        <div className={cx('item')}>
            <div className={cx('img-item')}>
                <img src={props.avatar} alt={props.name} />
            </div>
            <div className={cx('info')}>
                <h3>
                    <Link to={`/article-detail/${props.category_id}-${props.id}`}>{props.name}</Link>
                </h3>
                <p>
                    <span>
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </span>
                    {props.created_at}
                </p>
            </div>
        </div>
    );
}

export default Item;
