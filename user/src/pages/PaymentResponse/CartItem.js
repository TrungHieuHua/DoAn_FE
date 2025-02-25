import classNames from 'classnames/bind';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './Cart.module.scss';

import { updateCart, deleteCart } from '~/ultils/services/cartService';

import { getbyid } from '~/ultils/services/productService';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function CartItem({ item, onUpdateTotal }) {
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        // const fetchData = async () => {
        //     const response = await getbyid(item.product.id);
        //     setProduct(response.data[0]);
        // };
        // fetchData();
    }, [item]);

    const formatPrice = useMemo(
        () => new Intl.NumberFormat('vi-VN').format(item.productDetail.price),
        [item.productDetail.price],
    );
    const handleUpdate = useCallback((newQuantity) => {
        setQuantity(newQuantity);
        const fetchData = async () => {
            await updateCart({
                productDetailId: item.productDetail.id,
                quantity: newQuantity,
            });
        };

        fetchData();
    }, []);

    const handleRemoveFromCart = useCallback(() => {
        const fetchData = async () => {
            await deleteCart([item.id]);
            onUpdateTotal();
        };
        fetchData();
    }, []);

    return (
        <tr>
            <td>
                <img src={item.productDetail.img} alt="n" />
            </td>
            <td>
                <div>
                    <p
                        style={{
                            maxWidth: '400px',
                        }}
                    >
                        [ Size: {item.productDetail.size} ] - {item.productName}
                    </p>
                </div>
            </td>
            <td>{formatPrice}đ</td>
            <td>
                <input
                    value={quantity}
                    onChange={(e) => {
                        let newQuantity = parseInt(e.target.value);
                        onUpdateTotal(v4());
                        handleUpdate(newQuantity);
                    }}
                    style={{ textAlign: 'center' }}
                    type="number"
                    min="1"
                />
            </td>
            <td>
                <FontAwesomeIcon onClick={handleRemoveFromCart} className={cx('delete-icon')} icon={faTrashCan} />
            </td>
        </tr>
    );
}

export default CartItem;
