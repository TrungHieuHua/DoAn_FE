import classNames from 'classnames/bind';

import styles from './ArticlesIntro.module.scss';
import Item from './Item';
import Button from '~/components/Button';
import { getall } from '~/ultils/services/articlesService';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function ArticlesIntro({ title, id }) {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', id, '');
            if (response.status === 'success') {
                setItems(response.data);
            } else {
                setItems([]);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            <h1>{title}</h1>
            <div className={cx('list')}>
                {items.map((item) => {
                    return <Item key={v4()} props={item} />;
                })}
            </div>
            <div className={cx('all')}>
                <Button text to={`/articles/${id}`}>
                    Xem tất cả {title}
                </Button>
            </div>
        </div>
    );
}

export default ArticlesIntro;
