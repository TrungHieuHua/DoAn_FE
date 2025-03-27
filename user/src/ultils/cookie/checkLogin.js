import { getCookie, deleteCookie } from '~/ultils/cookie';

import { getall } from '~/ultils/services/categoriesService';

export const isLogin = () => {
    const token = getCookie('accessToken');
    return !!token;
};

export const getUserId = () => {
    const token = getCookie('accessToken');
    if (!token) return null;
    
    try {
        // Decode JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log('Token payload:', payload); // Để debug

        // Nếu là admin
        if (payload.sub === 'admin') return 1;
        
        // Nếu là user thường, lấy id từ token
        if (payload.data && payload.data.id) {
            return Number(payload.data.id);
        }

        return null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
