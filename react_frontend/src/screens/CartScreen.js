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
  Badge,
} from 'react-bootstrap';
import { FaTrash, FaLock, FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { createOrder } from '../actions/orderActions';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const removeFromCartHandler = (id, productname) => {
    try {
      dispatch(removeFromCart(id));
      toast.success(`${productname} removed from cart`);
    } catch (error) {
      toast.error('Error removing item from cart');
    }
  };

  const updateCartQuantity = (productId, quantity, stockcount, productname) => {
    if (quantity > stockcount) {
      toast.error(`Only ${stockcount} ${productname} available in stock`);
      return;
    }
    if (quantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    dispatch(addToCart(productId, Number(quantity)));
    toast.success(`${productname} quantity updated`);
  };

  const checkoutHandler = async () => {
    if (!userInfo) {
      navigate('/login?redirect=/cart');
      return;
    }

    try {
      // Create order object
      const order = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          qty: item.qty,
          price: item.price,
          productname: item.productname,
          image: item.image
        })),
        shippingAddress: {
          address: userInfo.address || "Default Address",
          city: userInfo.city || "Default City",
          postalCode: userInfo.postalCode || "123456",
          country: userInfo.country || "India"
        },
        paymentMethod: "PayPal", // Default payment method
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: Number(totalPrice),
        user: userInfo._id,
        timestamp: "2025-06-16 20:05:14",
        createdBy: "gps-rajput"
      };

      // Dispatch create order action
      const createdOrder = await dispatch(createOrder(order));
      
      // Clear cart items from localStorage
      localStorage.removeItem('cartItems');
      
      // Navigate to order screen
      navigate(`/order/${createdOrder._id}`);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating order');
    }
  };

  return (
    <div className="py-3">
      <Row>
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Shopping Cart</h1>
            <Link to="/" className="btn btn-outline-primary">
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Link>
          </div>
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
                      <Badge bg={item.stockcount > 0 ? 'success' : 'danger'} className="ms-2">
                        {item.stockcount > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
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
                            item.stockcount,
                            item.productname
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
                        onClick={() => removeFromCartHandler(item.product, item.productname)}
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
          <Card className="shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                  <small className="text-muted">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </small>
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
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      variant={userInfo ? "primary" : "secondary"}
                      className="btn-block"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      <FaLock className="me-2" />
                      {userInfo ? 'Place Order' : 'Login to Checkout'}
                    </Button>
                    {!userInfo && (
                      <small className="text-muted text-center">
                        Please login to complete your purchase
                      </small>
                    )}
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
                <ListGroup.Item>
                  <small className="text-muted">
                    Last updated: 2025-06-16 20:05:14
                    <br />
                    By: gps-rajput
                  </small>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;