import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, priceLower, priceBigger, cates, procedureIds, page, perPage) => {
    try {
        const res = await httpRequest.post('v1/products/search', {
            role: 'USER',
            priceLower,
            priceBigger,
            name: n,
            categoryIds: [...cates],
            procedureIds: [...procedureIds],
            page,
            size: perPage,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const search = async (n, l1, l2, s) => {
    try {
        const res = await httpRequest.get('product/search.php', {
            params: {
                n: n,
                l1: l1,
                l2: l2,
                s: s,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('product/delete.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req) => {
    try {
        const res = await httpRequest.post('product/post.php', req);
        console.log(res.data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/products/' + id, {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbycate = async (id) => {
    try {
        const res = await httpRequest.get('product/getbycategoryid.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('product/update.php', req);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
