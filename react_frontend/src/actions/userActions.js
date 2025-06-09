import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
} from '../constants/userConstants';

// Login action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const response = await fetch('/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,  // Changed from email to username
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || (data.username && data.username[0]) || 'Invalid credentials');
        }

        const userInfo = {
            ...data,
            email: email,
            name: data.name || email.split('@')[0],
            token: data.token
        };

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        });

        localStorage.setItem('userInfo', JSON.stringify(userInfo));

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.message
        });
    }
};

// Register action remains the same
export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const response = await fetch('/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }

        const userInfo = {
            ...data,
            name: name,
            email: email,
            token: data.token
        };

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: userInfo
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        });

        localStorage.setItem('userInfo', JSON.stringify(userInfo));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.message
        });
    }
};

// Logout action
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    
    dispatch({ type: USER_LOGOUT });
    
    window.location.href = '/login';
};