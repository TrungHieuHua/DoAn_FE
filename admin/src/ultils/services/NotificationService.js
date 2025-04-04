import axios from 'axios';

export const getNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/v1/notifications', {
            headers: {
               'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            data: response.data.data // API trả về mảng notifications trực tiếp
        };
    } catch (error) {
        console.error('Notification API Error:', error);
        return {
            statusCode: error.response?.status || 500,
            data: [],
            error: 'Có lỗi xảy ra khi tải thông báo'
        };
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `http://localhost:8080/api/v1/notifications/${notificationId}/read`,
            {},
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            statusCode: 200,
            data: response.data
        };
    } catch (error) {
        console.error('Mark as read Error:', error);
        return {
            statusCode: error.response?.status || 500,
            error: 'Có lỗi xảy ra khi đánh dấu đã đọc'
        };
    }
}; 