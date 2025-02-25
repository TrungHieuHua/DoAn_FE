import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, c, s) => {
    try {
        const res = await httpRequest.get('news/getall.php', {
            params: {
                n: n,
                c: c,
                s: s,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('news/getbyid.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('news/delete.php', {
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
        const res = await httpRequest.post('news/post.php', req);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const update = async (req) => {
    try {
        const res = await httpRequest.update('news/update.php', req);
        return res;
    } catch (e) {
        console.log(e);
    }
};
