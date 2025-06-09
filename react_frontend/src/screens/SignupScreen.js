import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';

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

    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            dispatch(register(name, email, password));
        }
    };

    return (
        <Row className="justify-content-md-center mt-5">
            <Col md={6}>
                <div style={formStyle}>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {message && <Message variant='danger'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}
                    
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='mb-3'>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter full name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-dark text-light"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='email' className='mb-3'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-dark text-light"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-dark text-light"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group controlId='confirmPassword' className='mb-4'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-dark text-light"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                type='submit' 
                                variant='primary'
                                className="py-2"
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </Form>

                    <Row className='py-3'>
                        <Col className="text-center">
                            Already have an account?{' '}
                            <Link to='/login' className="text-primary">
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