import axios from 'axios';
import config from '~/config';
import { getCookie } from '~/ultils/cookie';

export const createFeedback = async (data) => {
    try {
        const token = getCookie('accessToken');
        const response = await axios.post(`http://localhost:8080/api/v1/feedbacks`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFeedbacksByProductId = async (productId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/feedbacks/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 