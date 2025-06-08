export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const TIMESTAMP_FORMAT = process.env.REACT_APP_TIMESTAMP_FORMAT || 'YYYY-MM-DD HH:mm:ss';

export const API_ENDPOINTS = {
    PRODUCTS: '/products',
    PRODUCT_DETAILS: (id) => `/products/${id}`,
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
    REFRESH_TOKEN: '/users/login/refresh',
};