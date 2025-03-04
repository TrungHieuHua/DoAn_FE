import * as httpRequest from '~/ultils/httpRequest';

export const getall = async () => {
    try {
        const res = await httpRequest.post('v1/vouchers/search', {
            role: 'USER',
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
