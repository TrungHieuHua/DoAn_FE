import classNames from 'classnames/bind';
import styles from './Order.module.scss';
import Modal from './CancelModal';

import { getbyuserid, deleted } from '~/ultils/services/OrdersService';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Button from '~/components/Button';
import { toast } from 'react-toastify';

import {
    shippingMethodOptions,
    getDes,
    orderStatusOptions,
    paymentMethodOptions,
    paymentStatusOptions,
} from '~/config/orderOption';
import { colorPalette, getColorName } from '~/config/colorPalette';

const cx = classNames.bind(styles);

function Orders() {
    const [orders, setOrders] = useState([]);
    const [active, setActive] = useState('');
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyuserid();
            if (response.statusCode === 200) {
                setOrders(response.data);
            } else {
                setOrders([]);
            }
        };
        fetchData();
    }, [showModal]);

    useEffect(() => {
        setProducts(active.orderDetails || []);
    }, [active]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleCancelOrder = async (reason) => {
        try {
            const response = await deleted(active.id, reason); // Call API to delete order
            if (response.statusCode === 204) {
                setOrders((prevOrders) => prevOrders.filter((order) => order.id !== active.id));
                toast.success('Hủy đơn hàng thành công!');
                setActive({ ...active, status: 'CANCELED' });
            } else {
                toast.error('Hủy đơn hàng không thành công!');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Có lỗi xảy ra!');
        }
        setShowModal(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('list')}>
                <h3>Danh sách đơn hàng</h3>
                <div className={cx('class-fake')}>
                    <div className={cx('scroll')}>
                        {orders.map((item) => {
                            const formatPrice = new Intl.NumberFormat('vi-VN').format(item.totalAmount);
                            return (
                                <div
                                    onClick={() => {
                                        setActive(item);
                                    }}
                                    key={v4()}
                                    className={cx('item')}
                                    style={item === active ? { background: '#ddd' } : { background: '#eee' }}
                                >
                                    <p>Mã đơn: {item.id}</p>
                                    <p>Ngày tạo: {formatDate(item.createdAt)}</p>
                                    <p>Tổng tiền: {formatPrice}đ</p>
                                    <div
                                        className={cx('status')}
                                        style={
                                            item.status === 'DELIVERED'
                                                ? { background: 'green' }
                                                : item.status === 'CANCELED'
                                                ? { background: 'red' }
                                                : { background: 'orange' }
                                        }
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={cx('detail')}>
                <h3>Chi tiết đơn hàng</h3>
                {active ? (
                    <div>
                        <h4>Mã đơn: {active.id}</h4>
                        <div className={cx('info')}>
                            <p>Người nhận: {active.fullName}</p>
                            <p>Địa chỉ: {active.shippingAddress}</p>
                            <p>Điện thoại: {active.phone}</p>
                            <p>Trạng thái: {getDes(active.status, orderStatusOptions)}</p>
                            <p>Phương thức vận chuyển: {getDes(active.shippingMethod, shippingMethodOptions)}</p>
                            <p>Phương thức thanh toán: {getDes(active.paymentMethod, paymentMethodOptions)}</p>
                            <p>Trạng thái thanh toán: {getDes(active.paymentStatus, paymentStatusOptions)}</p>
                            <p>Thành tiền: {new Intl.NumberFormat('vi-VN').format(active.totalAmount)}đ</p>
                        </div>
                        <div>
                            <p>Ghi chú: {active.note}</p>
                        </div>
                        <div className={cx('pd-list')}>
                            <h4>Danh sách mặt hàng</h4>
                            {products.length > 0 ? (
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <th>Tên sản phẩm</th>
                                            <th width={70}>Size</th>
                                            <th width={120}>Màu sắc</th>
                                            <th width={140}>Giá bán</th>
                                            <th width={50}>Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((item) => (
                                            <tr key={v4()}>
                                                <td>
                                                    <img src={item.productDetail.img} alt={item.productDetail.name} />
                                                </td>
                                                <td>{item.productName}</td>
                                                <td>{item.productDetail.size}</td>
                                                <td>{getColorName(item.productDetail.color)}</td>
                                                <td width={140}>
                                                    {new Intl.NumberFormat('vi-VN').format(item.productDetail.price)}đ
                                                </td>
                                                <td width={50} style={{ textAlign: 'center' }}>
                                                    {item.quantity}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : null}
                        </div>
                        <div className={cx('action')}>
                            {active.status === 'PENDING' ? (
                                <Button
                                    className={cx('btn-delete')}
                                    primary
                                    small
                                    onClick={() => {
                                        setShowModal(true);
                                    }}
                                >
                                    Hủy đơn
                                </Button>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div>Chọn đơn hàng để xem chi tiết</div>
                )}
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(reason) => handleCancelOrder(reason)}
            />
        </div>
    );
}

export default Orders;
