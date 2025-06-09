import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
} from '../constants/userConstants';

// Helper to get current formatted datetime
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
};

// Login action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        // Clear any existing user data
        localStorage.removeItem('userInfo');

        const response = await fetch('/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Invalid credentials');
        }

        // Create user info with required fields
        const userInfo = {
            ...data,
            token: data.token,
            name: data.name || email.split('@')[0],
            email: email,
            lastLogin: getCurrentDateTime(),
            isAdmin: data.isAdmin || false
        };

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        });

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.message
        });
    }
};

// Register action
export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        // Clear any existing user data
        localStorage.removeItem('userInfo');

        const response = await fetch('/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }

        // Create user info with required fields
        const userInfo = {
            ...data,
            token: data.token,
            name: name,
            email: email,
            lastLogin: getCurrentDateTime(),
            isAdmin: false
        };

        // Register success also logs the user in
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: userInfo
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        });

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.message
        });
    }
};

// Logout action
export const logout = () => (dispatch) => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: 'CART_CLEAR_ITEMS' });
    
    // Redirect to login
    window.location.href = '/login';
};