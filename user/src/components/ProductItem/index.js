import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './ProductItem.module.scss';

const cx = classNames.bind(styles);

function ProductItem({ props }) {
    const formatPrice = new Intl.NumberFormat('vi-VN').format(props.priceRange);
    const navigate = useNavigate();

    // Lọc danh sách các màu duy nhất
    const uniqueColors = Array.from(new Set(props.productDetailResponseList.map((item) => item.color))).map((color) => {
        return props.productDetailResponseList.find((item) => item.color === color);
    });

    return (
        <div
            className={cx('wrapper')}
            onClick={() => {
                navigate(`/product-detail/${props.id}`);
            }}
        >
            {props.amount <= 0 ? <div className={cx('modal')}>Hết hàng</div> : null}
            <div className={cx('img')}>
                <img src={props.img} alt={props.name} />
            </div>
            {uniqueColors.length > 0 ? (
                <div className={cx('colors')}>
                    {uniqueColors.map((item, index) => (
                        <p
                            key={index}
                            style={{ background: item.color }}
                            title={item.colorName || 'Color'}
                            tabIndex={-1} // Ngăn focus
                        ></p>
                    ))}
                </div>
            ) : null}

            <div className={cx('info')}>
                <p>{props.name}</p>
                <p>{formatPrice}đ</p>
            </div>
        </div>
    );
}

export default ProductItem;
