import { getCookie, deleteCookie } from '~/ultils/cookie';

import { getall } from '~/ultils/services/categoriesService';

export const isLogin = () => {
    let data = getCookie('accessToken');

    if (data) return true;
    else return false;
};
