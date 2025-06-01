import axios from 'axios';
import config from '~/config';
import * as httpRequest from '~/ultils/httpRequest';
const getProductCluster = async () => {
    try {
        const res = await httpRequest.get('v1/kmeans/productCluster', {});
        return res;
    } catch (error) {
        console.error('Error fetching product cluster:', error);
        throw error;
    }
};

const getCustomerSegments = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/kmeans/segment`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer segments:', error);
        throw error;
    }
};

export { getProductCluster, getCustomerSegments };
