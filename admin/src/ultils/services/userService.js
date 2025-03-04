import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, s, page, perPage) => {
    try {
        const res = await httpRequest.post('v1/users/search', {
            email: n,
            role: s ? s : 'ADMIN',
            page: page,
            size: perPage || 10000000000,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const count = async () => {
    try {
        const res = await httpRequest.get('customer/count.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const topprice = async () => {
    try {
        const res = await httpRequest.get('customer/topprice.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/users/' + id, {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('customer/update.php', req);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const block = async (req) => {
    try {
        const res = await httpRequest.update('v1/users/block?id=' + req.id, {
            params: {
                id: req.id,
            },
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
