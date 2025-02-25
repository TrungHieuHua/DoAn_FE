import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (s, n) => {
    try {
        const res = await httpRequest.post('v1/categories/search', {
            role: 'USER',
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/categories/' + id, {
            params: {
                id: id,
                role: 'USER',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('category/delete.php', {
            params: {
                id: id,
            },
        });
        console.log(res.data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req) => {
    try {
        const res = await httpRequest.post('category/post.php', req);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('category/update.php', req);
        return res;
    } catch (e) {
        console.log(e);
    }
};
