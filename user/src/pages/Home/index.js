import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import ProductsIntro from '~/components/ProductsIntro';

import { getall } from '~/ultils/services/categoriesService';
import { useEffect, useState } from 'react';
import Slider from '~/Layouts/components/Slider';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Home() {
    const [cate, setCate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', '');
            if (response.statusCode === 200) {
                setCate(response.result);
            } else {
                setCate([]);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('slider')}>
                <Slider />
            </div>
            {cate.map((item) => {
                return <ProductsIntro key={v4()} title={item.name} id={item.id} />;
            })}
        </div>
    );
}

export default Home;
