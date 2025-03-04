export const shippingMethodOptions = [
    {
        title: 'FAST',
        description: 'Nhanh',
    },
    {
        title: 'EXPRESS',
        description: 'Hỏa tốc',
    },
];

export const paymentStatusOptions = [
    {
        title: 'WAITING',
        description: 'Chưa thanh toán',
    },
    {
        title: 'COMPLETE',
        description: 'Đã thanh toán',
    },
];
export const paymentMethodOptions = [
    {
        title: 'CASH',
        description: 'Thanh toán khi nhận hàng',
    },
    {
        title: 'CREDIT_CARD',
        description: 'Thanh toán online',
    },
];

export const orderStatusOptions = [
    {
        title: 'PENDING',
        description: 'Chờ xử lý',
    },
    {
        title: 'CONFIRMED',
        description: 'Xác nhận',
    },
    {
        title: 'PROCESSING',
        description: 'Đang xử lý',
    },
    {
        title: 'SHIPPED',
        description: 'Đang vận chuyển',
    },
    {
        title: 'DELIVERED',
        description: 'Đã giao',
    },
    {
        title: 'CANCELED',
        description: 'Hủy',
    },
];

export const getDes = function (title, options) {
    return options.find((option) => option.title === title)
        ? options.find((option) => option.title === title).description
        : null;
};
