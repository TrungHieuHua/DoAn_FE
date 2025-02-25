import classNames from 'classnames/bind';

import styles from './ProductsIntro.module.scss';
import ProductItem from '../ProductItem';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { getall } from '~/ultils/services/productService';
import { useState, useEffect } from 'react';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function ProductsIntro({ title, id }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall('', '', '', [id], []);
            if (response.statusCode === 200) {
                setProducts(response.result.slice(0, 4));
            } else {
                setProducts([]);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>{title}</h2>
            <div className={cx('list')}>
                {products.map((item) => {
                    return <ProductItem key={v4()} props={item} />;
                })}
            </div>
            <div className={cx('more')}>
                <Button outline large to={`/products/${id}`} rightIcon={<FontAwesomeIcon icon={faAngleRight} />}>
                    Xem tất cả {title}
                </Button>
            </div>
        </div>
    );
}

export default ProductsIntro;
