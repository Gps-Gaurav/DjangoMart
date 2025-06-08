import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/userActions';
import Loader from '../Loader';
import FormContainer from '../FormContainer';
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill in all fields');
      return;
    }
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1 className='text-center mb-4'>Sign In</h1>
      {message && <Alert variant='danger'>{message}</Alert>}
      {error && <Alert variant='danger'>{error}</Alert>}
      {loading && <Loader />}
      
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='mb-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password' className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button 
          type='submit' 
          variant='primary' 
          className='w-100 mb-3'
          disabled={loading}
        >
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/signup?redirect=${redirect}` : '/signup'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;