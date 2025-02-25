import * as httpRequest from '~/ultils/httpRequest';

export const upload = async (req) => {
    try {
        const res = await httpRequest.post('v1/uploads', {
            file: req.file
        });
        
        return res;
    } catch (error) {
        console.log(error);
    }
};