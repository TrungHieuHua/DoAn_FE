import axios from 'axios';

export const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:8080/api/login', {
            username,
            password
        });

        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            return {
                statusCode: 200,
                data: response.data
            };
        }
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        return {
            statusCode: error.response?.status || 500,
            error: error.response?.data?.message || 'Đăng nhập thất bại'
        };
    }
};

export const logout = () => {
    localStorage.removeItem('token');
}; 