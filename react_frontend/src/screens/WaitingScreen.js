import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function WaitingScreen() {
    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="bg-dark text-white p-4">
                        <Card.Body className="text-center">
                            <i className="fas fa-envelope-open-text fa-4x mb-3"></i>
                            <h2>Please Verify Your Email</h2>
                            <p className="lead">
                                We've sent a verification link to your email address.
                                Please check your inbox and click the link to activate your account.
                            </p>
                            <hr />
                            <div className="mt-3">
                                <p className="mb-0">
                                    <small>
                                        Don't see the email? Check your spam folder or
                                        <br />contact support if you need assistance.
                                    </small>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default WaitingScreen;