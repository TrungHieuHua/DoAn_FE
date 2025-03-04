import classNames from 'classnames/bind';
import { Link, useParams } from 'react-router-dom';
import styles from './Articles.module.scss';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { getall } from '~/ultils/services/categoriesService';

const cx = classNames.bind(styles);

function ArticleSidebar() {
    const [active, setActive] = useState(1);
    const [menu, setMenu] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        setActive(id.split('-')[0]);
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', '', '');
            if (response.status === 'success') {
                setMenu(response.data);
            } else {
                setMenu([]);
            }
        };
        fetchData();
    }, []);

    return (
        <aside className={cx('sidebar')}>
            {menu.map((item) => {
                return item.type === '1' ? (
                    <div
                        key={v4()}
                        onClick={() => {
                            setActive(item.id);
                        }}
                        className={cx('menu')}
                    >
                        <Link
                            style={active === item.id ? { color: '#0066CC' } : { color: '#131313' }}
                            to={`/articles/${item.id}`}
                        >
                            {item.name}
                        </Link>
                    </div>
                ) : null;
            })}
        </aside>
    );
}

export default ArticleSidebar;
