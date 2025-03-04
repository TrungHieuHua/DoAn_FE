import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (c) => {
    try {
        const res = await httpRequest.get('event/getall.php', {
            params: {
                c: c,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('event/getbyid.php', {
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
        const res = await httpRequest.deleted('event/delete.php', {
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
        const res = await httpRequest.post('event/post.php', req);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('event/update.php', req);
        return res;
    } catch (e) {
        console.log(e);
    }
};
