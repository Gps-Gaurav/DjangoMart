import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, Form, Button, NavDropdown } from "react-bootstrap";

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>Ecommerce Cart</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="fa-solid fa-house"></i> Home
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/cart">
              <Nav.Link>Cart</Nav.Link>
            </LinkContainer>
            
            <NavDropdown title="New User?" id="basic-nav-dropdown">
              <LinkContainer to="/login">
                <NavDropdown.Item>Login</NavDropdown.Item>
              </LinkContainer>
              
              <LinkContainer to="/signup">
                <NavDropdown.Item>Signup</NavDropdown.Item>
              </LinkContainer>
              
              <NavDropdown.Divider />
              <NavDropdown.Item>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="secondary" type="submit">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;