import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './Articles.module.scss';
import ArticlesIntro from '~/components/ArticlesIntro';
import Item from '~/components/ArticlesIntro/Item';
import { getall } from '~/ultils/services/categoriesService';
import { getall as getallar } from '~/ultils/services/articlesService';
import { v4 } from 'uuid';
import ArticleSidebar from './ArticleSidebar';

const cx = classNames.bind(styles);

function Articles() {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', '', '');
            if (response.status === 'success') {
                setArticles(response.data);
            } else {
                setArticles([]);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const response = await getallar('', id.split('-')[0], '');
                if (response.status === 'success') {
                    setItems(response.data);
                } else {
                    setItems([]);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            {id ? (
                <div className={cx('list')}>
                    <ArticleSidebar />
                    <div className={cx('items')}>
                        {items.map((item) => {
                            return <Item key={v4()} props={item} />;
                        })}
                    </div>
                </div>
            ) : (
                <div>
                    {articles.map((item) => {
                        return item.type === '1' ? <ArticlesIntro key={v4()} id={item.id} title={item.name} /> : null;
                    })}
                </div>
            )}
        </div>
    );
}

export default Articles;
