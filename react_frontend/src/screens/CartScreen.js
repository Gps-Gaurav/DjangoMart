import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <Row className="mt-4">
      <Col md={8}>
        <h2 className="mb-4 fw-bold">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty. <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className="py-3">
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`} className="text-decoration-none">
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>
                    <strong>
                      ₹{parseFloat(item.price).toLocaleString("en-IN")}
                    </strong>
                  </Col>
                  <Col md={2}>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(addToCart(item.product, Number(e.target.value)))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash text-danger"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
              </h4>
              ₹
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toLocaleString("en-IN")}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn btn-warning w-100 fw-bold"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;