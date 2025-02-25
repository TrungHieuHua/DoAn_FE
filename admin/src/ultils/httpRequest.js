import axios from 'axios';
import { getCookie, deleteCookie } from '~/ultils/cookie'; // Đảm bảo rằng getCookie đang hoạt động chính xác

const accessToken = getCookie('accessToken');

const httpRequest = axios.create({
    baseURL: 'http://localhost:8080/api/',
    headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    withCredentials: true,
});

// Thực hiện các phương thức HTTP (GET, POST, DELETE, PUT)
export const get = async (path, option = {}) => {
    try {
        const response = await httpRequest.get(path, option);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            deleteCookie("accessToken");
        }
        console.error('Error in GET request:', error);
        throw error;
    }
};

export const post = async (path, req) => {
    try {
        const response = await httpRequest.post(path, req);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            deleteCookie("accessToken");
        }
        console.error('Error in POST request:', error);
        throw error;
    }
};

export const deleted = async (path, option = {}) => {
    try {
        const response = await httpRequest.delete(path, option);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            deleteCookie("accessToken");
        }
        console.error('Error in DELETE request:', error);
        throw error;
    }
};

export const update = async (path, req) => {
    try {
        const response = await httpRequest.put(path, req);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            deleteCookie("accessToken");
        }
        console.error('Error in PUT request:', error);
        throw error;
    }
};


export default httpRequest;
