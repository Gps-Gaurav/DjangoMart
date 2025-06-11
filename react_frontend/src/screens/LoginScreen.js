import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';

const loginFormStyle = {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '10px',
    color: '#fff'
};

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    // Get user login state
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin || {};


    useEffect(() => {
        // If userInfo exists and has required fields, redirect
        if (userInfo && Object.keys(userInfo).length > 0) {
            // Remove any stored user info that might be causing issues
            localStorage.removeItem('tempUserInfo');
            // Redirect to home or specified redirect path
            navigate('/');
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            return;
        }

        try {
            // Clear any existing error states
            localStorage.removeItem('loginError');
            
            // Dispatch login action
            await dispatch(login(email, password));
            
            // Clear form
            setEmail('');
            setPassword('');

        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <Row className="justify-content-md-center mt-5">
            <Col md={6}>
                <div style={loginFormStyle}>
                    <h2 className="text-center mb-4">Sign In</h2>
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='email' className='mb-3'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-dark text-light"
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-4'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-dark text-light"
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                type='submit' 
                                variant='primary'
                                className="py-2"
                                disabled={loading || !email || !password}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </div>
                    </Form>

                    <Row className='py-3'>
                        <Col className="text-center">
                            New Customer?{' '}
                            <Link 
                                to={'/signup'}
                                className="text-primary"
                            >
                                Register here
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

export default LoginScreen;