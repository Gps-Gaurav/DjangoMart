import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, Form, Button, NavDropdown, InputGroup } from "react-bootstrap";

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
          <Form className="d-flex mx-auto" style={searchBarStyle}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search for products..."
                className="bg-dark text-light border-secondary"
                aria-label="Search"
                style={{
                  borderRight: 'none',
                  boxShadow: 'none',
                  '&:focus': {
                    borderColor: '#6c757d'
                  }
                }}
              />
              <Button 
                variant="outline-secondary"
                className="d-flex align-items-center"
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
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  0
                </span>
              </Nav.Link>
            </LinkContainer>

            <NavDropdown 
              title={
                <span>
                  <i className="fas fa-user-circle me-1"></i>
                  Gps-Gaurav
                </span>
              } 
              id="basic-nav-dropdown"
              align="end"
              className="ms-2"
            >
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
              
              <LinkContainer to="/login">
                <NavDropdown.Item>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login
                </NavDropdown.Item>
              </LinkContainer>
              
              <LinkContainer to="/signup">
                <NavDropdown.Item>
                  <i className="fas fa-user-plus me-2"></i>
                  Signup
                </NavDropdown.Item>
              </LinkContainer>
              
              <NavDropdown.Divider />
              <NavDropdown.Item className="text-danger">
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;