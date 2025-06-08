import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, Form, Button, NavDropdown, InputGroup } from "react-bootstrap";
import { logout } from '../actions/userActions'; // You'll need to create this action

const headerStyle = {
  backgroundColor: '#1a1a1a',
  padding: '15px 0',
  borderBottom: '2px solid #333'
};

const searchBarStyle = {
  maxWidth: '500px',
  width: '100%'
};

const brandStyle = {
  color: '#fff',
  fontSize: '24px',
  fontWeight: 'bold',
  textDecoration: 'none',
  transition: 'color 0.3s ease'
};

const navLinkStyle = {
  color: '#fff',
  transition: 'color 0.3s ease',
  fontSize: '16px',
  padding: '8px 15px',
  borderRadius: '5px'
};

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get user info from Redux store
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  // Get cart items count from Redux store
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return (
    <Navbar style={headerStyle} variant="dark" expand="lg" sticky="top">
      <Container fluid>
        {/* Left Section - Brand */}
        <LinkContainer to="/">
          <Navbar.Brand style={brandStyle}>
            <i className="fas fa-shopping-cart me-2"></i>
            DjangoMart
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left Navigation */}
          <Nav className="me-auto ms-3">
            <LinkContainer to="/">
              <Nav.Link style={navLinkStyle}>
                <i className="fa-solid fa-house me-1"></i> Home
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/products">
              <Nav.Link style={navLinkStyle}>
                <i className="fas fa-tags me-1"></i> Products
              </Nav.Link>
            </LinkContainer>
          </Nav>

          {/* Center - Search Bar */}
          <Form className="d-flex mx-auto" style={searchBarStyle} onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search for products..."
                className="bg-dark text-light border-secondary"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRight: 'none',
                  boxShadow: 'none',
                }}
              />
              <Button 
                variant="outline-secondary"
                className="d-flex align-items-center"
                type="submit"
              >
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>

          {/* Right Section - Cart & User */}
          <Nav className="ms-auto">
            <LinkContainer to="/cart">
              <Nav.Link style={navLinkStyle} className="position-relative">
                <i className="fas fa-shopping-cart me-1"></i>
                Cart
                {cartItems?.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Nav.Link>
            </LinkContainer>

            {userInfo ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="fas fa-user-circle me-1"></i>
                    {userInfo.name}
                  </span>
                } 
                id="basic-nav-dropdown"
                align="end"
                className="ms-2"
              >
                <div className="px-3 py-2 text-muted small border-bottom">
                  Last login: {currentTime}
                </div>
                
                <LinkContainer to="/profile">
                  <NavDropdown.Item>
                    <i className="fas fa-user me-2"></i>
                    Profile
                  </NavDropdown.Item>
                </LinkContainer>
                
                <LinkContainer to="/orders">
                  <NavDropdown.Item>
                    <i className="fas fa-shopping-bag me-2"></i>
                    Orders
                  </NavDropdown.Item>
                </LinkContainer>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item 
                  className="text-danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav>
                <LinkContainer to="/login">
                  <Nav.Link style={navLinkStyle}>
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Nav.Link>
                </LinkContainer>
                
                <LinkContainer to="/signup">
                  <Nav.Link style={navLinkStyle}>
                    <i className="fas fa-user-plus me-1"></i>
                    Signup
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;