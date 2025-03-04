import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { v4 } from 'uuid';
import { create } from '~/ultils/services/OrdersService';
import { getCart } from '~/ultils/services/cartService';
import { getCookie, deleteCookie } from '~/ultils/cookie';
import { isLogin } from '~/ultils/cookie/checkLogin';
import routes from '~/config/routes';

function PaymentResponse() {
    const navigate = useNavigate(); // Tạo navigate instance
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [selectedVoucherObject, setSelectedVoucherObject] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        shippingAddress: '',
        shippingMethod: 'FAST',
        paymentMethod: 'CREDIT_CARD',
        phone: '',
        note: '',
    });

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
    }, []);

    useEffect(() => {
        const submit = async () => {
            if (items.length > 0) {
                const pdIds = items.map((item) => item.id);

                if (getCookie('billingInfo') && getCookie('totalAmounnt')) {
                    setBillingInfo(getCookie('billingInfo'));
                    setTotal(getCookie('totalAmounnt'));
                    setSelectedVoucherObject(getCookie('voucher'));
                } else {
                    navigate(routes.cart);
                    return;
                }

                const payload = {
                    fullName: billingInfo.fullName,
                    shippingAddress: billingInfo.shippingAddress,
                    shippingMethod: 'FAST',
                    paymentMethod: paymentMethod,
                    phone: billingInfo.phone,
                    note: billingInfo.note,
                    price_total: total,
                    cartDetailIds: pdIds,
                    voucherId: selectedVoucherObject ? selectedVoucherObject.id : null,
                };

                if (isLogin()) {
                    const fetchData = async () => {
                        const response = await create(payload);
                        if (response) {
                            deleteCookie('billingInfo');
                            deleteCookie('totalAmounnt');
                            deleteCookie('voucher');
                            navigate(routes.login);
                        } else {
                            alert(response.data.message);
                        }
                    };
                    fetchData();
                } else {
                    alert('Đăng nhập để đặt hàng');
                }
            } else {
                // navigate(routes.cart);
            }
        };

        submit();
    }, [items, navigate]);

    return <div>Chờ Xử Lý</div>;
}

export default PaymentResponse;
