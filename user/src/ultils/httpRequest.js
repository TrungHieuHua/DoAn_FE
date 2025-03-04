import axios from 'axios';
import { getCookie } from '~/ultils/cookie'; // Đảm bảo rằng getCookie đang hoạt động chính xác

const accessToken = getCookie('accessToken');

const httpRequest = axios.create({
    baseURL: 'http://localhost:8080/api/',
    headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    withCredentials: true,
});

export const get = async (path, option = {}) => {
    const response = await httpRequest.get(path, option);
    return response.data;
};

export const post = async (path, req) => {
    const response = await httpRequest.post(path, req);
    return response;
};

export const deleted = async (path, option = {}) => {
    const response = await httpRequest.delete(path, option);
    return response;
};

export const update = async (path, req) => {
    const response = await httpRequest.put(path, req);
    return response;
};

export default httpRequest;
