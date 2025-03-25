import axios from 'axios';
import config from '~/config';

export const createFeedback = async (data) => {
    try {
        const response = await axios.post(`${config.API_URL}/api/v1/feedbacks`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFeedbacksByProductId = async (productId) => {
    try {
        const response = await axios.get(`${config.API_URL}/api/v1/feedbacks/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 