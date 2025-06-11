import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';
import { googleAuth, githubAuth } from '../actions/authActions';
import { useGoogleLogin } from '@react-oauth/google';
import Message from '../components/Message';
import Loader from '../components/Loader';

const loginFormStyle = {
  backgroundColor: '#2a2a2a',
  padding: '2rem',
  borderRadius: '10px',
  color: '#fff',
};

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const auth = useSelector((state) => state.auth);

  const { loading, error, userInfo } = userLogin || {};
  const {
    loading: socialLoading,
    error: socialError,
    userInfo: socialUser,
  } = auth || {};

  // ✅ Redirect after login (email or social)
  useEffect(() => {
    const user = userInfo || socialUser;
    if (user && Object.keys(user).length > 0) {
      localStorage.removeItem('tempUserInfo');
      navigate('/');
    }
  }, [userInfo, socialUser, navigate]);

  // ✅ Handle GitHub redirect callback (code in URL)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      dispatch(githubAuth(code));
    }
  }, [location.search, dispatch]);

  // ✅ Submit Email/Password login
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await dispatch(login(email, password));
    setEmail('');
    setPassword('');
  };

  // ✅ Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      if (response?.access_token) {
        await dispatch(googleAuth(response.access_token));
      }
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  // ✅ GitHub redirect to OAuth
  const handleGitHubLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GITHUB_REDIRECT_URI;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = githubUrl;
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col md={6}>
        <div style={loginFormStyle}>
          <h2 className="text-center mb-4">Sign In</h2>

          {(error || socialError) && (
            <Message variant="danger">{error || socialError}</Message>
          )}

          {(loading || socialLoading) && <Loader />}

          {/* Email/Password Login */}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-dark text-light"
                required
                disabled={loading || socialLoading}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-dark text-light"
                required
                disabled={loading || socialLoading}
                minLength={6}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                className="py-2"
                disabled={loading || socialLoading || !email || !password}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </Form>

          {/* Social Logins */}
          <hr className="my-4" />
          <div className="text-center mb-3">Or Sign in with</div>

          <div className="d-flex justify-content-center gap-3">
            <Button variant="danger" onClick={googleLogin} disabled={socialLoading}>
              Google
            </Button>
            <Button variant="dark" onClick={handleGitHubLogin} disabled={socialLoading}>
              GitHub
            </Button>
          </div>

          <Row className="py-3">
            <Col className="text-center">
              New Customer?{' '}
              <Link to="/signup" className="text-primary">
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
