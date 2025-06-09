import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails } from '../actions/productsActions';

function StarRating({ rating, maxRating = 10 }) {
  const starsTotal = 5;
  const filledStars = Math.round((rating / maxRating) * starsTotal);
  return (
    <div className="d-flex align-items-center">
      {[...Array(starsTotal)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill={i < filledStars ? '#FFC107' : '#e4e5e9'}
          className="bi bi-star-fill me-1"
          viewBox="0 0 16 16"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.32-.158-.888.283-.95l4.898-.696 2.18-4.327c.197-.39.73-.39.927 0l2.18 4.327 4.898.696c.441.062.612.63.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      ))}
    </div>
  );
}

function ProductScreen() {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product = {} } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const formatPrice = (price) => Number(price).toFixed(2);

  const handleQtyChange = (e) => {
    setQty(Number(e.target.value));
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product || !product.productname) return <Message variant="danger">Product not found</Message>;

  return (
    <Container className="my-5">
      <Row>
        {/* Left: Large Product Image with zoom */}
        <Col md={6} className="mb-4">
          <div className="product-image-wrapper position-relative" style={{ cursor: 'zoom-in' }}>
            <Image
              src={product.image}
              alt={product.productname}
              fluid
              rounded
              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
              className="shadow-sm"
              style={{ maxHeight: '500px', objectFit: 'contain', width: '100%' }}
            />
          </div>
        </Col>

        {/* Middle: Product Info */}
        <Col md={4}>
          <h2 className="fw-bold">{product.productname}</h2>
          <p className="text-muted mb-1">Brand: <strong>{product.productbrand}</strong></p>

          <div className="d-flex align-items-center mb-2">
            <StarRating rating={Number(product.rating)} />
            <span className="ms-2 text-muted">({product.numReviews} reviews)</span>
          </div>

          <h3 className="text-success fw-bold my-3">${formatPrice(product.price)}</h3>

          <p className="text-secondary">{product.productinfo}</p>

          <ListGroup variant="flush" className="mt-4">
            <ListGroup.Item>
              <strong>Category:</strong> {product.productcategory}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Created at:</strong> {new Date(product.createdAt).toLocaleDateString()}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Updated at:</strong> {new Date(product.updatedAt).toLocaleDateString()}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Right: Sticky Add to Cart */}
        <Col md={2}>
          <Card className="shadow-sm sticky-top" style={{ top: '80px' }}>
            <ListGroup variant="flush" className="p-3">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Price:</span>
                <span className="fw-bold">${formatPrice(product.price)}</span>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Status:</span>
                <span className={product.stockcount > 0 ? 'text-success' : 'text-danger'}>
                  {product.stockcount > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </ListGroup.Item>

              {product.stockcount > 0 && (
                <ListGroup.Item>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Select
                    aria-label="Quantity"
                    value={qty}
                    onChange={handleQtyChange}
                  >
                    {[...Array(Math.min(product.stockcount, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Select>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className="w-100 btn-lg"
                  variant="warning"
                  disabled={product.stockcount === 0}
                  onClick={addToCartHandler}
                >
                  {product.stockcount > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductScreen;
