import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap';

const footerStyle = {
  backgroundColor: '#2a2a2a',
  color: '#fff',
  padding: '40px 0',
  marginTop: 'auto', // This helps push footer to bottom
  width: '100%'
};

const socialLink = {
  color: '#fff',
  marginRight: '10px',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  marginBottom: '10px'
};

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh' // This ensures the page takes at least full viewport height
};

function Footer() {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  
  // Format current UTC date and time as specified
  const formatUTCDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-GB', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+), /, '$3-$2-$1 ');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setToastMessage('Please enter an email address');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToastMessage('Successfully subscribed to newsletter!');
      setShowToast(true);
      setEmail('');
    } catch (error) {
      setToastMessage('Failed to subscribe. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div className="flex-grow-1">
        {/* Your main content goes here */}
      </div>
      
      <Toast
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        bg="info"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      
      <footer style={footerStyle}>
        <Container>
          <Row>
            <Col md={3}>
              <h5>About Us</h5>
              <p>Your trusted online shopping destination for quality products and excellent service.</p>
            </Col>

            <Col md={3}>
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" style={socialLink}>Home</Link></li>
                <li><Link to="/products" style={socialLink}>Products</Link></li>
                <li><Link to="/categories" style={socialLink}>Categories</Link></li>
                <li><Link to="/contact" style={socialLink}>Contact</Link></li>
              </ul>
            </Col>

            <Col md={3}>
              <h5>Contact Info</h5>
              <ul className="list-unstyled">
                <li>
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                  <a href="mailto:info@djangomart.com" style={socialLink}>
                    info@djangomart.com
                  </a>
                </li>
                <li>
                  <i className="fas fa-phone" aria-hidden="true"></i>
                  <a href="tel:+12345678900" style={socialLink}>
                    +1 234 567 8900
                  </a>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                  <span> 123 E-Commerce St</span>
                </li>
              </ul>
            </Col>

            <Col md={3}>
              <h5>Follow Us</h5>
              <div className="social-links d-flex flex-column">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={socialLink}
                >
                  <i className="fab fa-facebook" aria-hidden="true"></i> Facebook
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={socialLink}
                >
                  <i className="fab fa-twitter" aria-hidden="true"></i> Twitter
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={socialLink}
                >
                  <i className="fab fa-instagram" aria-hidden="true"></i> Instagram
                </a>
              </div>
            </Col>
          </Row>
          <Form onSubmit={handleSubscribe}>
            <Row className="align-items-center">
              <Col md={8}>
                <Form.Control
                  type="email"
                  placeholder="Enter your email for updates"
                  aria-label="Email subscription"
                  style={{ height: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Col>
              <Col md={4}>
                <Button 
                  type="submit"
                  variant="primary"
                  className="w-100"
                  style={{ height: '40px' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </Col>
            </Row>
          </Form>
          <hr style={{ borderColor: '#333' }} />
          
          <div className="text-center">
            <p className="mb-1">
              Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {formatUTCDateTime()}
            </p>
            <p className="mb-1">
              Current User's Login: {localStorage.getItem('username') || 'Gps-Gaurav'}
            </p>
            <p className="mb-0">
              &copy; {currentYear} DjangoMart. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;