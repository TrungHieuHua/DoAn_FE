import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import FormInput from '~/components/AuthForm/FormInput';
import Button from '~/components/Button';
import CartItem from './CartItem';
import routes from '~/config/routes';

import { useNavigate } from 'react-router-dom';

// import { getCart, calculateTotal } from '~/ultils/session';
import styles from './Cart.module.scss';
import { v4 } from 'uuid';
import { getCookie, setCookie } from '~/ultils/cookie';
import { create, payments_vnpay, payments_response } from '~/ultils/services/OrdersService';
import { getProfile } from '~/ultils/services/userService';
import { isLogin } from '~/ultils/cookie/checkLogin';
import { getCart } from '~/ultils/services/cartService';
import { getall } from '~/ultils/services/voucherService';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCab, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import ModalLoading from './ModalLoading';

const cx = classNames.bind(styles);

function Cart() {
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedValueVoucher, setSelectedValueVoucher] = useState('');
    const [selectedVoucherObject, setSelectedVoucherObject] = useState(null);
    const [voucherList, setVoucherList] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [shippingMethod, setShippingMethod] = useState('FAST');
    const [reloadComponent, setReloadComponent] = useState('');
    const [checkedList, setCheckedList] = useState([]); // State to track checked items

    const navigate = useNavigate();

    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        shippingAddress: '',
        shippingMethod: 'FAST',
        paymentMethod: 'CASH',
        phone: '',
        note: '',
    });

    const calculateTotal = (cartItems, checkedList) => {
        return cartItems
            .filter((item) => checkedList.includes(item.id)) // Filter checked items
            .reduce((total, item) => total + item.productDetail.price * item.quantity, 0); // Calculate total for checked items
    };

    useEffect(() => {
        if (isLogin()) {
            const fetchData = async () => {
                const response = await getProfile();
                const user = response.data;
                setBillingInfo({
                    ...billingInfo,
                    fullName: `${user.firstName} ${user.lastName}`,
                    shippingAddress: `${user.address}`,
                    phone: '',
                });
            };
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (isLogin()) {
            const fetchData = async () => {
                const response = await getCart(1);
                if (response.statusCode === 200) {
                    setItems(response.data.cartDetails);
                }
            };

            fetchData();
        }
    }, [selectedVoucherObject, reloadComponent]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getall();
            if (response.statusCode === 200) {
                setVoucherList(response.result);
            } else {
                setVoucherList([]);
            }
        };

        fetchData();
    }, [reloadComponent]);

    const validate = function () {
        const phoneRegex = /^[0-9]{10,11}$/; // Chỉ chấp nhận số có 10-11 chữ số
        if (billingInfo.fullName && billingInfo.shippingAddress && billingInfo.phone) {
            if (!phoneRegex.test(billingInfo.phone)) {
                toast.warn('Số điện thoại không hợp lệ');
                return false;
            } else {
                return true;
            }
        } else {
            toast.warn('Vui lòng nhập đủ thông tin liên hệ');
            return false;
        }
    };

    useEffect(() => {
        if (items.length === 0) {
            setTotal(0);
            return;
        }

        // Calculate the total for only checked items
        let total = calculateTotal(items, checkedList);
        let totalDiscount = 0;

        // Apply the voucher discount if any
        if (selectedVoucherObject) {
            totalDiscount = (total * selectedVoucherObject.value) / 100;

            // Apply the maximum discount limit
            if (totalDiscount > selectedVoucherObject.maxMoney) {
                totalDiscount = selectedVoucherObject.maxMoney;
            }

            total = total - totalDiscount;
        }

        if (checkedList.length > 0) {
            if (shippingMethod === 'FAST') total += 15000;
            else total += 50000;
        }

        setTotal(total);
    }, [items, selectedVoucherObject, checkedList, reloadComponent, selectedValueVoucher, shippingMethod]);

    // Handle checkbox change for individual item
    const handleCheckboxChange = (itemId) => {
        setCheckedList((prevCheckedList) => {
            const isChecked = prevCheckedList.includes(itemId);
            if (isChecked) {
                return prevCheckedList.filter((id) => id !== itemId); // Uncheck item
            } else {
                return [...prevCheckedList, itemId]; // Check item
            }
        });
    };

    const submit = async () => {
        if (!validate()) {
            return;
        }

        setIsSubmitting(true); // Disable nút

        const pdIds = items.filter((item) => checkedList.includes(item.id)).map((item) => item.id);

        const payload = {
            fullName: billingInfo.fullName,
            shippingAddress: billingInfo.shippingAddress,
            shippingMethod: shippingMethod,
            paymentMethod: paymentMethod,
            phone: billingInfo.phone,
            note: billingInfo.note,
            price_total: total,
            cartDetailIds: pdIds,
            voucherId: selectedVoucherObject ? selectedVoucherObject.id : null,
        };

        try {
            if (isLogin()) {
                const response = await create(payload);
                if (response.statusCode === 201) {
                    navigate(`?s=success`);
                    setCheckedList([]);
                    setReloadComponent(v4());
                    setIsSubmitting(false);
                    if (paymentMethod === 'CREDIT_CARD') {
                        const response2 = await payments_vnpay(total, response.data);
                        if (response2.statusCode === 200 && response2.data.code === 'ok') {
                            window.open(response2.data.paymentUrl, '_blank');
                        }
                    } else {
                        navigate(`?s=success`);
                        setCheckedList([]);
                        setReloadComponent(v4());
                        toast.success('Đặt hàng thành công');
                    }
                } else {
                    toast.error(response.message);
                }
            } else {
                toast.warn('Đăng nhập để đặt hàng');
            }
        } catch (error) {
            console.error('Error during submit:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
        }
    };

    return (
        <>
            <ModalLoading show={isSubmitting} />
            {items.length ? (
                <div className={cx('wrapper')}>
                    {items.length > 0 ? (
                        <>
                            <div className={cx('left')}>
                                <div className={cx('pd-list')}>
                                    <table
                                        onClick={() => {
                                            setReloadComponent(v4());
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th rowSpan={2} className={cx('checked')}>
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => {
                                                            // Check/uncheck all items
                                                            if (checkedList.length === items.length) {
                                                                setCheckedList([]); // Uncheck all
                                                            } else {
                                                                setCheckedList(items.map((item) => item.id)); // Check all
                                                            }
                                                        }}
                                                        checked={checkedList.length === items.length}
                                                    />
                                                </th>
                                                <th rowSpan={2}>Hình ảnh</th>
                                                <th colSpan={2} width={700} style={{ textAlign: 'center' }}>
                                                    Chi tiết
                                                </th>
                                                <th rowSpan={2} width={150}>
                                                    Giá bán
                                                </th>
                                                <th rowSpan={2} width={80}>
                                                    Số lượng
                                                </th>
                                                <th rowSpan={2} width={50}></th>
                                            </tr>
                                            <tr>
                                                <th>Tên sản phẩm</th>
                                                <th width={70} style={{ maxWidth: '70px' }}>
                                                    Màu sắc
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => (
                                                <CartItem
                                                    key={item.id}
                                                    item={item}
                                                    onUpdateTotal={() => {
                                                        setReloadComponent(v4());
                                                        navigate(`?a=${item.id}`);
                                                    }}
                                                    reloadComponent={reloadComponent}
                                                    checked={checkedList.includes(item.id)} // Set checked status
                                                    onCheckboxChange={() => handleCheckboxChange(item.id)} // Handle individual checkbox change
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className={cx('other-handel')}>
                                        <Button outline to={routes.home}>
                                            Tiếp tục mua sắm
                                        </Button>
                                    </div>
                                </div>
                                <h3>Thông tin thanh toán</h3>
                                <div className={cx('billing-info')}>
                                    <FormInput
                                        label="Họ tên"
                                        value={billingInfo.fullName !== 'null' ? billingInfo.fullName : ''}
                                        onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                                    />
                                    <FormInput
                                        label="Địa chỉ"
                                        value={
                                            billingInfo.shippingAddress !== 'null' ? billingInfo.shippingAddress : ''
                                        }
                                        onChange={(e) =>
                                            setBillingInfo({ ...billingInfo, shippingAddress: e.target.value })
                                        }
                                    />
                                    <div className={cx('contact')}>
                                        <FormInput
                                            label="Điện thoại"
                                            value={billingInfo.phone !== 'null' ? billingInfo.phone : ''}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Ghi chú: </label>
                                        <textarea
                                            className={cx('note')}
                                            value={billingInfo.note}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, note: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('right')}>
                                <div className={cx('sidebar-cart')}>
                                    <div className={cx('voucher')}>
                                        <div>Voucher</div>
                                        <div>
                                            <select
                                                onChange={(e) => {
                                                    setSelectedValueVoucher(e.target.value);
                                                    const selectedCode = e.target.value;
                                                    const selectedVoucherObj = voucherList.find(
                                                        (voucher) => voucher.code === selectedCode,
                                                    );
                                                    if (selectedVoucherObj) {
                                                        setSelectedVoucherObject(selectedVoucherObj);
                                                    } else {
                                                        setSelectedVoucherObject(null);
                                                    }
                                                    setReloadComponent(v4());
                                                }}
                                                value={selectedValueVoucher}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f9f9f9',
                                                    color: '#333',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                <option value="">Chọn voucher</option>
                                                {voucherList.map((value) => {
                                                    return (
                                                        <option key={v4()} value={value.code}>{`${value.code}`}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={cx('voucherDescription')}>
                                        {selectedVoucherObject ? (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#f9f9f9',
                                                    color: '#333',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6',
                                                    marginTop: '10px',
                                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: selectedVoucherObject.description,
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                    <br />
                                    <div className={cx('ShippingMethod')}>
                                        <div>Phương thức vận chuyển</div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="shippingmethod"
                                                id="shippingmethod1"
                                                value="FAST"
                                                defaultChecked
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                            />
                                            &nbsp;
                                            <label htmlFor="shippingmethod1">Nhanh</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="shippingmethod"
                                                id="shippingmethod2"
                                                value="EXPRESS"
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                            />
                                            &nbsp;
                                            <label htmlFor="shippingmethod2">Hỏa tốc</label>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '10px' }} className={cx('PaymentMethod')}>
                                        <div>Phương thức thanh toán</div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="paymentmethod"
                                                id="paymentmethod1"
                                                value="CASH"
                                                defaultChecked
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            &nbsp;
                                            <label htmlFor="paymentmethod1">Thanh toán khi nhận hàng</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="paymentmethod"
                                                id="paymentmethod2"
                                                value="CREDIT_CARD"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            &nbsp;
                                            <label htmlFor="paymentmethod2">Thanh toán online</label>
                                        </div>
                                    </div>
                                    <br />
                                    {checkedList.length > 0 ? (
                                        <div>
                                            <i>
                                                <div>
                                                    Giá sản phẩm:{' '}
                                                    {new Intl.NumberFormat('vi-VN').format(
                                                        total - (shippingMethod === 'FAST' ? 15000 : 50000),
                                                    )}
                                                    đ
                                                </div>
                                                <div>
                                                    Phí vận chuyển: {shippingMethod === 'FAST' ? '15.000đ' : '50.000đ'}
                                                </div>
                                            </i>
                                        </div>
                                    ) : null}

                                    <div className={cx('sum')}>
                                        <p>Tổng cộng: </p>
                                        <p>{new Intl.NumberFormat('vi-VN').format(total)}đ</p>
                                    </div>
                                    <div>
                                        <Button
                                            className={cx('btn-submit')}
                                            onClick={submit}
                                            primary
                                            disabled={isSubmitting || checkedList.length <= 0} // Disable khi đang chờ response
                                        >
                                            {isSubmitting ? 'Đang xử lý...' : 'Đặt Hàng'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            ) : (
                <div className={cx('empty-cart')}>
                    <FontAwesomeIcon icon={faCartPlus} />
                </div>
            )}
        </>
    );
}

export default Cart;
