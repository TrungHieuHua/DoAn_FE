import * as httpRequest from '~/ultils/httpRequest';

export const getCart = async (req) => {
    try {
        const res = await httpRequest.get('v1/carts', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateCart = async (req) => {
    const actionType = req.actionType === 0 ? req.actionType : 1;
    try {
        const res = await httpRequest.update(
            'v1/carts?productDetailId=' +
                req.productDetailId +
                '&quantity=' +
                req.quantity +
                '&actionType=' +
                actionType,
            {
                params: {
                    productDetailId: req.productDetailId,
                    quantity: req.quantity,
                    actionType,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteCart = async (ids) => {
    try {
        const res = await httpRequest.deleted('v1/carts/cart-details?ids=' + ids, {});
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
