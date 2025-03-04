import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (id, t) => {
    try {
        const res = await httpRequest.get('orders/getall.php', {
            params: {
                id: id,
                t: t,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req) => {
    try {
        const res = await httpRequest.post('v1/orders', req);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const getrecents = async () => {
    try {
        const res = await httpRequest.get('orders/getrecents.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const count = async () => {
    try {
        const res = await httpRequest.get('orders/count.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('orders/getbyid.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const getbyuserid = async (id) => {
    try {
        const res = await httpRequest.get('v1/orders/users', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
    }
};

export const deleted = async (id, reason) => {
    try {
        const res = await httpRequest.deleted('v1/orders/orders/' + id + '/cancel?reason=' + reason, {});
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response;
    }
};

export const payments_vnpay = async (amount, vnp_TxnRef) => {
    try {
        const res = await httpRequest.get('v1/payments/vn-pay?amount=' + amount + '&orderId=' + vnp_TxnRef, {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const payments_response = async (urlResponse) => {
    try {
        fetch(urlResponse)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('payment res', data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.log(error);
    }
};
