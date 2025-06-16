import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping over ₹1000
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% tax
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const removeFromCartHandler = (id) => {
    try {
      dispatch(removeFromCart(id));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item from cart');
    }
  };

  const updateCartQuantity = (productId, quantity, stockcount) => {
    if (quantity > stockcount) {
      toast.error('Selected quantity exceeds stock limit');
      return;
    }
    if (quantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    dispatch(addToCart(productId, Number(quantity)));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="py-3">
      <Row>
        <Col md={8}>
          <h1 className="mb-4">Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message variant="info">
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product} className="py-3">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={item.image}
                        alt={item.productname}
                        fluid
                        rounded
                        className="cart-image"
                      />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/product/${item.product}`}
                        className="text-decoration-none"
                      >
                        {item.productname}
                      </Link>
                    </Col>
                    <Col md={2}>₹{item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          updateCartQuantity(
                            item.product,
                            Number(e.target.value),
                            item.stockcount
                          )
                        }
                        className="form-select"
                      >
                        {[...Array(item.stockcount).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>₹{(item.price * item.qty).toFixed(2)}</Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>₹{itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>
                      {shippingPrice === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `₹${shippingPrice.toFixed(2)}`
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax (18%):</Col>
                    <Col>₹{taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total:</strong>
                    </Col>
                    <Col>
                      <strong>₹{totalPrice}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      className="btn-block"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed To Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
                {cartItems.length > 0 && shippingPrice > 0 && (
                  <ListGroup.Item>
                    <Message variant="info">
                      Add ₹{(1000 - itemsPrice).toFixed(2)} more to get free
                      shipping!
                    </Message>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;