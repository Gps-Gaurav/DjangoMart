import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Message from '../components/Message';
import { activateAccount } from '../actions/userActions';

function WaitingScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { uid, token } = useParams();

    const [currentTime, setCurrentTime] = useState(new Date().toISOString().replace('T', ' ').slice(0, 19));
    const currentUser = 'Gps-Gaurav';

    const userVerify = useSelector((state) => state.userVerify) || {};
    const { loading = false, error, success } = userVerify;

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toISOString().replace('T', ' ').slice(0, 19);
            setCurrentTime(formattedTime);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Activate only if uid and token present (i.e. on /activate/ route)
    useEffect(() => {
        if (uid && token) {
            dispatch(activateAccount(uid, token));
        }
    }, [dispatch, uid, token]);

    // Redirect after successful activation
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    // If user visits /verify-email without uid/token, just show "Please verify your email" message
    const isVerifyEmailPage = location.pathname === '/verify-email';

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
                            ) : success ? (
                                <>
                                    <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                                    <h3>Account Activated!</h3>
                                    <p>Redirecting to login page...</p>
                                    <small>Current Time (UTC): {currentTime}</small>
                                    <br />
                                    <small>User: {currentUser}</small>
                                </>
                            ) : isVerifyEmailPage ? (
                                <>
                                    <i className="fas fa-envelope fa-4x mb-3"></i>
                                    <h3>Please Verify Your Email</h3>
                                    <p>We've sent you an activation link.</p>
                                    <p>Please check your email and click the link to activate your account.</p>
                                    <small>Current Time (UTC): {currentTime}</small>
                                    <br />
                                    <small>User: {currentUser}</small>
                                </>
                            ) : (
                                <>
                                    {/* Show default message for activate route when no success or error */}
                                    <i className="fas fa-envelope fa-4x mb-3"></i>
                                    <h3>Waiting for activation...</h3>
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
