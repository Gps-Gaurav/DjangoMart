import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_VERIFY_REQUEST,
    USER_VERIFY_SUCCESS,
    USER_VERIFY_FAIL
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
                username: email,
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

// Register action
// Register action
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

        // Dispatch success with minimal data
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: {
                email: email,
                name: name,
                needsVerification: true
            }
        });

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.message
        });
    }
};

// Verify email action
export const verifyEmail = (token) => async (dispatch) => {
    try {
        dispatch({ type: USER_VERIFY_REQUEST });

        const response = await fetch(`/api/users/activate/${token}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Verification failed');
        }

        dispatch({
            type: USER_VERIFY_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_VERIFY_FAIL,
            payload: error.message
        });
    }
};
// Add this to your existing userActions.js
export const activateAccount = (uid, token) => async (dispatch) => {
    try {
        dispatch({ type: USER_VERIFY_REQUEST });

        const response = await fetch(`/api/users/activate/${uid}/${token}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Activation failed');
        }

        dispatch({
            type: USER_VERIFY_SUCCESS,
            payload: data
        });

        // Redirect to login after successful activation
        window.location.href = '/login';

    } catch (error) {
        dispatch({
            type: USER_VERIFY_FAIL,
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

export default {login,logout,register,verifyEmail, activateAccount};