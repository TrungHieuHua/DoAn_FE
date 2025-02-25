import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import styles from './Articles.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Article from '~/components/Article';
import FormArticles from './FormArticles';
import FormFilter from './FormFilter';
import { getall } from '~/ultils/services/articlesService';

const cx = classNames.bind(styles);

function Articles() {
    const [data, setData] = useState([]);
    const [deleted, setDeleted] = useState('');
    const [idShow, setIdShow] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [created, setCreated] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall(name, category, status);
            if (response.status === 'success') {
                setData(response.data);
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [deleted, created, name, category, status]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormArticles
                    title="Thêm Bài Viết"
                    id={idShow}
                    onSuccess={() => {
                        setCreated(v4());
                    }}
                    onClose={() => {
                        setIdShow('');
                        setShowForm(false);
                    }}
                />
            ) : null}
            <WhiteBG title="Quản Lý Bài Viết">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            search={(n, c, s) => {
                                setName(n);
                                setCategory(c);
                                setStatus(s);
                            }}
                            Add={() => {
                                setShowForm(true);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((props) => {
                            return (
                                <Article
                                    onUpdate={() => {
                                        setIdShow(props.id);
                                    }}
                                    onEventDeleted={onEventDeleted}
                                    key={v4()}
                                    props={props}
                                />
                            );
                        })}
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Articles;
