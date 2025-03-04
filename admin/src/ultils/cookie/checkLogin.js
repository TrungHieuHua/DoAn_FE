import { getCookie } from '~/ultils/cookie';

export const isLogin = () => {
    let data = getCookie('accessToken');

    if (data) return true;
    else return false;
};
