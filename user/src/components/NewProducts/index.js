import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './NewProducts.module.scss';
import ProductItem from '../ProductItem';
import { getNewProducts } from '~/ultils/services/productService';
import { v4 } from 'uuid';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import required modules
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

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
                    // Lấy tất cả sản phẩm mới thay vì chỉ lấy 4 sản phẩm
                    setNewProducts(response.data || []);
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
            <Swiper
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    // when window width is >= 480px
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    // when window width is >= 1024px
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                }}
                className={cx('swiper')}
            >
                {newProducts.map((product) => (
                    <SwiperSlide key={v4()} className={cx('swiper-slide')}>
                        <div className={cx('product-item')}>
                            <ProductItem props={product} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default NewProducts;
