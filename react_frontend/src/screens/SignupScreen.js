import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import { GoogleLogin } from '@react-oauth/google';
import { googleAuth, githubAuth } from '../actions/authActions';

const formStyle = {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '10px',
    color: '#fff'
};

function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userRegister = useSelector((state) => state.userRegister);
    const { loading, error, success } = userRegister;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin || {};

    const authState = useSelector((state) => state.auth);
    const { loading: authLoading, error: authError, isAuthenticated } = authState || {};

    useEffect(() => {
        if (success) {
            navigate('/verify-email');
        }
    }, [success, navigate]);

    useEffect(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
          }
          
        if (userInfo || isAuthenticated) {

            navigate('/');
        }
    }, [userInfo, isAuthenticated, navigate]);

    // Fixed: Only register on signup form submit
    const submitHandler = (e) => {
        e.preventDefault();
        setMessage('');
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            dispatch(register(name, email, password));
        }
    };

    const handleGitHubLogin = () => {
        const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
        window.location.href = githubUrl;
    };

    // ✅ GitHub Callback Handler
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (code) {
            dispatch(githubAuth(code));
        }
    }, [location.search, dispatch]);

    // ✅ Memoized Google Callback
    const handleGoogleSuccess = useCallback(
        async (response) => {
            if (response?.credential) {
                try {
                    const result = await dispatch(googleAuth(response.credential));
                    if (result?.user) {
                        localStorage.setItem('userInfo', JSON.stringify(result.user));
                        localStorage.setItem('access_token', result.tokens.access);
                        localStorage.setItem('refresh_token', result.tokens.refresh);
                        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: result.user });
                        navigate('/');
                    }
                } catch (error) {
                    setMessage('Google authentication failed');
                }
            }
        },
        [dispatch, navigate]
    );

    const handleGoogleError = useCallback(() => {
        setMessage('Google authentication failed');
    }, []);

    return (
        <Row className="justify-content-md-center mt-5">
            <Col md={6}>
                <div style={formStyle}>
                    <h2 className="text-center mb-4">Sign Up</h2>

                    {message && <Message variant="danger">{message}</Message>}
                    {error && <Message variant="danger">{error}</Message>}
                    {authError && <Message variant="danger">{authError}</Message>}
                    {(loading || authLoading) && <Loader />}

                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-dark text-light"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-dark text-light"
                                required
                            />
                            <Form.Text className="text-muted">You'll need to verify this email</Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-dark text-light"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" className="mb-4">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-dark text-light"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button type="submit" variant="primary" className="py-2" disabled={loading}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </Form>

                    <div className="my-3 text-center text-light">OR</div>

                    <div className="d-grid gap-2 mb-3">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            width="100%"
                        />
                    </div>

                    <div className="d-grid gap-2 mb-4">
                        <Button variant="dark" onClick={handleGitHubLogin}>
                            Continue with GitHub
                        </Button>
                    </div>

                    <Row className="py-3">
                        <Col className="text-center">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary">
                                Login
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

export default SignupScreen;