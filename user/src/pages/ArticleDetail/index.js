import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import { getbyid } from '~/ultils/services/articlesService';
import styles from './ArticleDetail.module.scss';
import ArticleSidebar from '../Articles/ArticleSidebar';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function AricleDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState({});

    useEffect(() => {
        if (id.split('-')[1]) {
            const fetchData = async () => {
                const response = await getbyid(id.split('-')[1]);
                if (response.status === 'success') {
                    setArticle(response.data[0]);
                } else {
                    setArticle({});
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            {id.split('-')[1] ? (
                <>
                    <ArticleSidebar />
                    <div className={cx('content')}>
                        <h2>{article.name}</h2>
                        <p className={cx('created_at')}>{article.created_at}</p>
                        <img src={article.avatar} alt="x" />
                        <div className={cx('summary')}>{article.summary}</div>
                        <div>{article.content}</div>
                    </div>
                </>
            ) : (
                <div>Sai liên kết</div>
            )}
        </div>
    );
}

export default AricleDetail;
