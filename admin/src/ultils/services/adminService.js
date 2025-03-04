import * as httpRequest from '~/ultils/httpRequest';

export const register = async (req) => {
    try {
        const res = await httpRequest.post('v1/users', {
            firstName: req.firstName,
            lastName: req.lastName,
            password: req.password,
            username: req.username,
            email: req.email,
            role: 'ADMIN',
        });
        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const login = async (req) => {
    try {
        const res = await httpRequest.post('login', {
            username: req.username,
            password: req.password,
        });
        return res.data;
    } catch (error) {
        return error.response;
    }
};
