import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Message from '../components/Message';
import { activateAccount } from '../actions/userActions';

function WaitingScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { uid, token } = useParams();
    
    // Add local state for time
    const [currentTime, setCurrentTime] = useState('2025-06-09 16:55:11');
    const currentUser = 'Gps-Gaurav';

    const userVerify = useSelector((state) => state.userVerify) || {};
    const { loading = false, error, success } = userVerify;

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toISOString()
                .replace('T', ' ')
                .slice(0, 19);
            setCurrentTime(formattedTime);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (uid && token) {
            dispatch(activateAccount(uid, token));
        }
    }, [dispatch, uid, token]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="p-4 my-5 bg-dark text-white">
                        <Card.Body className="text-center">
                            {loading ? (
                                <>
                                    <Spinner animation="border" role="status" className="mb-3" />
                                    <h3>Verifying your account...</h3>
                                </>
                            ) : error ? (
                                <Message variant="danger">{error}</Message>
                            ) : uid && token ? (
                                <>
                                    <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                                    <h3>Account Activated!</h3>
                                    <p>Redirecting to login page...</p>
                                    <small>Current Time (UTC): {currentTime}</small>
                                    <br />
                                    <small>User: {currentUser}</small>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-envelope fa-4x mb-3"></i>
                                    <h3>Please Verify Your Email</h3>
                                    <p>We've sent you an activation link.</p>
                                    <p>Please check your email and click the link to activate your account.</p>
                                    <small>Current Time (UTC): {currentTime}</small>
                                    <br />
                                    <small>User: {currentUser}</small>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default WaitingScreen;