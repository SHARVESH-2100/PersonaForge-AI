const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, '');
export const PRODUCTS_API_URL = `${API_BASE_URL}/products/`;
