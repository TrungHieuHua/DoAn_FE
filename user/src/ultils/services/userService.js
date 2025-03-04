import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (n, s) => {
    try {
        const res = await httpRequest.get('customer/getall.php', {
            params: {
                n: n,
                s: s,
            },
        });
        return res;
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

export const getProfile = async (user) => {
    try {
        const res = await httpRequest.get('v1/users', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('v1/users', {
            ...req,
            role: 'USER',
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const register = async (req) => {
    try {
        const res = await httpRequest.post('v1/users', {
            firstName: req.firstName,
            lastName: req.lastName,
            email: req.email,
            password: req.password,
            username: req.username,
            role: 'USER',
        });

        return res.data;
    } catch (error) {
        console.log(error);
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
        console.log(error);
        return error.response;
    }
};

export const forgotPassword = async (req) => {
    try {
        const res = await httpRequest.post('v1/users/forgot-password?email=' + req.email, {});
        return res.data;
    } catch (error) {
        console.log(error);

        return error.response.data;
    }
};

export const updatePassword = async (req) => {
    try {
        const res = await httpRequest.update('v1/users/password', {
            email: req.email,
            otp: req.otp,
            newPassword: req.password,
            // oldPassword: req.oldPassword,
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const changePassword = async (req) => {
    try {
        const res = await httpRequest.update('v1/users/password', req);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
