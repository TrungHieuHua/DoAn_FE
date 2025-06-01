import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './RecommendedProducts.module.scss';
import ProductItem from '../ProductItem';
import { getProductCluster } from '~/ultils/services/kmeansService';
import { isLogin } from '~/ultils/cookie/checkLogin';
import { v4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

const cx = classNames.bind(styles);

function RecommendedProducts() {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                if (isLogin()) {
                    const response = await getProductCluster();
                    if (response.statusCode === 200) {
                        // Lấy mảng data từ response và chỉ lấy 4 sản phẩm đầu tiên
                        setRecommendedProducts((response.data || []).slice(0, 4));
                    }
                }
            } catch (err) {
                setError('Không thể tải sản phẩm đề xuất');
                console.error('Error fetching recommended products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedProducts();
    }, []);

    if (!isLogin()) {
        return null; // Don't show recommendations for non-logged in users
    }

    if (loading) {
        return <div className={cx('loading')}>Đang tải sản phẩm đề xuất...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    if (!recommendedProducts || recommendedProducts.length === 0) {
        return null;
    }

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Sản phẩm đề xuất cho bạn</h2>
            <div className={cx('list')}>
                {recommendedProducts.map((product) => (
                    <ProductItem key={v4()} props={product} />
                ))}
            </div>
            <div className={cx('more')}>
                <Button outline large to="/recommended-products" rightIcon={<FontAwesomeIcon icon={faAngleRight} />}>
                    Xem tất cả sản phẩm đề xuất
                </Button>
            </div>
        </div>
    );
}

export default RecommendedProducts;
