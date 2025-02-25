import { Button, Modal, Table, Form, FormGroup, FormControl } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { getbyid, update } from '~/ultils/services/OrdersService';
import { v4 } from 'uuid';
import { toast } from 'react-toastify';
import { getColorName } from '~/config/colorPalette';
import {
    getDes,
    orderStatusOptions,
    paymentMethodOptions,
    paymentStatusOptions,
    shippingMethodOptions,
} from '~/config/orderOption';

function FormOrder({ onClose, id }) {
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getbyid(id);
                setOrderData(response.data);
                setStatus(response.data.status);
                setPaymentStatus(response.data.paymentStatus);
                setProducts(response.data.orderDetails);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [id]);

    function handleChangeStatus(e) {
        setStatus(e.target.value);
    }

    function handleChangePaymentStatus(e) {
        setPaymentStatus(e.target.value);
    }

    const statusOptions = [
        { status: 'PENDING' },
        { status: 'CONFIRMED' },
        { status: 'PROCESSING' },
        { status: 'SHIPPED' },
        { status: 'DELIVERED' },
        { status: 'CANCELED' },
    ];

    const paymentsStatusOptions = [{ status: 'WAITING' }, { status: 'COMPLETE' }];

    function onUpdateOrder() {
        if (id) {
            const data = {
                id: id,
                status: status,
                paymentStatus: paymentStatus,
            };
            const updateData = async () => {
                try {
                    const fetchAPI = await update(data);
                    if (fetchAPI.statusCode === 201) {
                        toast.success('Cập nhật trạng thái thành công!');
                        const refreshedData = await getbyid(id); // Reload data
                        setOrderData(refreshedData.data);
                        setProducts(refreshedData.data.orderDetails);
                    } else {
                        console.log(fetchAPI);
                        if (fetchAPI.message) toast.error(fetchAPI.message);
                        else toast.error(fetchAPI.data.message);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Đã xảy ra lỗi khi cập nhật.');
                }
            };
            updateData();
        }
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chi Tiết Đơn Hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {orderData ? (
                    <Form>
                        <FormGroup>
                            <Form.Label>Mã đơn:</Form.Label>
                            <FormControl disabled value={orderData.id} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Người nhận:</Form.Label>
                            <FormControl disabled value={orderData.fullName} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Địa chỉ:</Form.Label>
                            <FormControl disabled value={orderData.shippingAddress} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Điện thoại:</Form.Label>
                            <FormControl disabled value={orderData.phone} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Ghi chú:</Form.Label>
                            <FormControl disabled value={orderData.note} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Phương thức thanh toán: </Form.Label>
                            <FormControl disabled value={getDes(orderData.paymentMethod, paymentMethodOptions)} />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Trạng thái thanh toán: </Form.Label>
                            <Form.Control as="select" value={paymentStatus} onChange={handleChangePaymentStatus}>
                                {paymentsStatusOptions.map((s) => (
                                    <option key={v4()} value={s.status}>
                                        {getDes(s.status, paymentStatusOptions)}
                                    </option>
                                ))}
                            </Form.Control>
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Phương thức vận chuyển: </Form.Label>
                            <FormControl disabled value={getDes(orderData.shippingMethod, shippingMethodOptions)} />
                        </FormGroup>

                        <Form.Group controlId="status">
                            <Form.Label>Trạng thái: </Form.Label>
                            <Form.Control as="select" value={status} onChange={handleChangeStatus}>
                                {statusOptions.map((s) => (
                                    <option key={v4()} value={s.status}>
                                        {getDes(s.status, orderStatusOptions)}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <br />
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Số lượng</th>
                                    <th>Giá sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item) => (
                                    <tr key={v4()}>
                                        <td>{item.id}</td>
                                        <td>{getColorName(item.productDetail.color)}</td>
                                        <td>{item.productDetail.size}</td>
                                        <td>{item.quantity}</td>
                                        <td
                                            style={{
                                                textAlign: 'right',
                                            }}
                                        >
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(item.productDetail.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <FormGroup>
                            <Form.Label
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                Tổng tiền:{' '}
                            </Form.Label>
                            <FormControl
                                style={{
                                    textAlign: 'right',
                                }}
                                disabled
                                value={new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(orderData.totalAmount)}
                            />
                        </FormGroup>
                    </Form>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={onUpdateOrder}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormOrder;
