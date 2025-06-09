import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails } from '../actions/productsActions';

function ProductScreen() {
    const [qty, setQty] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product = {} } = productDetails; // Provide default empty object

    useEffect(() => {
        dispatch(listProductDetails(id));
    }, [dispatch, id]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    };

    // Format price with 2 decimal places
    const formatPrice = (price) => {
        return Number(price).toFixed(2);
    };

    // Handle quantity change
    const handleQtyChange = (e) => {
        setQty(Number(e.target.value));
    };

    if (loading) return <Loader />;
    if (error) return <Message variant='danger'>{error}</Message>;
    if (!product || !product.name) return <Message variant='danger'>Product not found</Message>;

    return (
        <div>
            <Row>
                <Col md={6}>
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        fluid 
                        className="product-detail-image"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg'; // Add fallback image
                        }}
                    />
                </Col>
                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Price:</strong> ${formatPrice(product.price)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Description:</strong> {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                        <strong>${formatPrice(product.price)}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                        <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col xs='auto' className='my-1'>
                                            <Form.Control
                                                as="select"
                                                value={qty}
                                                onChange={handleQtyChange}
                                                aria-label="Select quantity"
                                            >
                                                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button
                                    onClick={addToCartHandler}
                                    className='btn-block w-100'
                                    disabled={!product.countInStock}
                                    type='button'
                                >
                                    {product.countInStock ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default ProductScreen;