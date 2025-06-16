import { 
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
} from "../constants/productsConstants";

// API configuration
const API_BASE_URL = '/api'; // Adjust this based on your backend configuration

// Helper function to handle API errors
const handleApiError = (error) => {
    if (error.response?.data?.detail) {
        return error.response.data.detail;
    }
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    return error.message || 'An error occurred';
};

// Helper function for API calls
const fetchApi = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Action to get list of products
export const listProducts = () => async (dispatch) => {
    try {
        dispatch({ 
            type: PRODUCT_LIST_REQUEST 
        });
        
        const data = await fetchApi('/products/');

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: handleApiError(error)
        });
    }
};

// Action to get single product details
export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch product');
        }

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.message,
        });
    }
};
