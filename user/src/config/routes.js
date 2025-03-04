import { payments_response } from '~/ultils/services/OrdersService';
import { changePassword } from '~/ultils/services/userService';

const routes = {
    home: '/',
    products: '/products/:id',
    productDetail: '/product-detail/:id',
    articles: '/articles',
    articlesList: '/articles/:id',
    articleDetail: '/article-detail/:id',
    orders: '/orders',
    profile: '/profile',
    cart: '/cart',
    login: '/login',
    signup: '/signup',
    search: '/search',
    forgotPassword: '/forgot-password',
    changePassword: '/change-password',
    paymentsResponse: '/payments-response',
};

export default routes;
