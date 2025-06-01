import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './NewProducts.module.scss';
import ProductItem from '../ProductItem';
import { getNewProducts } from '~/ultils/services/productService';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function NewProducts() {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const response = await getNewProducts();
                if (response.statusCode === 200) {
                    // Lấy 4 sản phẩm đầu tiên
                    setNewProducts((response.data || []).slice(0, 4));
                }
            } catch (err) {
                setError('Không thể tải sản phẩm mới');
                console.error('Error fetching new products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    if (loading) {
        return <div className={cx('loading')}>Đang tải sản phẩm mới...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    if (!newProducts || newProducts.length === 0) {
        return null;
    }

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Sản phẩm mới</h2>
            <div className={cx('list')}>
                {newProducts.map((product) => (
                    <div key={v4()} className={cx('product-item')}>
                        <ProductItem props={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewProducts;
