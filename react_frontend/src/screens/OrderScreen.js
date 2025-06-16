import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails } from '../actions/orderActions';
import { FaCheck, FaTruck, FaBoxOpen, FaTimesCircle } from 'react-icons/fa';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;

  // Get user info for verification
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      toast.error('Please login to view order details');
      return;
    }

    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order, userInfo]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-success';
      case 'processing':
        return 'text-primary';
      case 'shipped':
        return 'text-info';
      case 'cancelled':
        return 'text-danger';
      default:
        return 'text-warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <FaCheck className="text-success" />;
      case 'processing':
        return <FaBoxOpen className="text-primary" />;
      case 'shipped':
        return <FaTruck className="text-info" />;
      case 'cancelled':
        return <FaTimesCircle className="text-danger" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <div className="py-3">
      <h1 className="mb-4">Order #{orderId}</h1>
      {order ? (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.user?.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}{' '}
                  {order.shippingAddress?.postalCode},{' '}
                  {order.shippingAddress?.country}
                </p>
                <div className={getStatusClass(order.status)}>
                  {getStatusIcon(order.status)}{' '}
                  <strong>Status: </strong>
                  {order.status}
                  {order.deliveredAt && ` (${formatDate(order.deliveredAt)})`}
                </div>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                <div className={order.isPaid ? 'text-success' : 'text-danger'}>
                  {order.isPaid ? (
                    <FaCheck className="me-2" />
                  ) : (
                    <FaTimesCircle className="me-2" />
                  )}
                  <strong>Status: </strong>
                  {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not Paid'}
                </div>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems?.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems?.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.productname}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.productname}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <h2>Order Summary</h2>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>₹{order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>₹{order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>₹{order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>₹{order.totalPrice}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {!order.isPaid && (
                  <ListGroup.Item>
                    <div className="d-grid gap-2">
                      <Button variant="primary" size="lg">
                        Pay Now
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <small className="text-muted">
                    Order placed on: {formatDate(order.createdAt)}
                    <br />
                    Last updated: {formatDate(order.updatedAt)}
                    <br />
                    Updated by: {order.updatedBy || 'System'}
                  </small>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      ) : (
        <Message variant="warning">Order not found</Message>
      )}
    </div>
  );
};

export default OrderScreen;