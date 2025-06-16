import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Button, Form, Badge } from "react-bootstrap";
import { FaShoppingCart, FaBolt, FaHeart, FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
import { listProductDetails } from "../actions/productsActions";
import { addToCart } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = () => {
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const formatPrice = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value > product.stockcount) {
      toast.warning(`Only ${product.stockcount} items available in stock`);
      setQty(product.stockcount);
    } else if (value < 1) {
      setQty(1);
    } else {
      setQty(value);
    }
  };

  const addToCartHandler = () => {
    try {
      dispatch(addToCart(id, qty));
      toast.success(`${product.productname} added to cart`);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", {
        error: error.message,
        timestamp: "2025-06-16 19:47:36",
        user: "gps-rajput",
        productId: id,
        quantity: qty
      });
    }
  };

  const buyNowHandler = () => {
    addToCartHandler();
    navigate("/cart");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.productname,
          text: `Check out ${product.productname} on our store!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share product");
    }
  };

  const toggleWishlist = () => {
    if (!userInfo) {
      toast.warning("Please login to add items to wishlist");
      return;
    }
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product || !product.productname) 
    return <Message variant="danger">Product not found</Message>;

  const images = [product.image].filter(Boolean);

  const getStockStatus = (count) => {
    if (count > 10) return { text: "In Stock", variant: "success" };
    if (count > 0) return { text: `Only ${count} left`, variant: "warning" };
    return { text: "Out of Stock", variant: "danger" };
  };

  const stockStatus = getStockStatus(product.stockcount);

  return (
    <div className="container my-5">
      <Row className="gx-5">
        <Col lg={6}>
          <div className="position-relative">
            <div className="border rounded p-3 mb-3 d-flex justify-content-center align-items-center bg-light"
                 style={{ minHeight: "400px" }}>
              <Image
                src={images[mainImage]}
                alt={product.productname}
                fluid
                className="product-main-image"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
            <div className="position-absolute top-0 end-0 p-2">
              <Button
                variant={isWishlist ? "danger" : "outline-danger"}
                className="rounded-circle me-2"
                onClick={toggleWishlist}
              >
                <FaHeart />
              </Button>
              <Button
                variant="outline-primary"
                className="rounded-circle"
                onClick={handleShare}
              >
                <FaShare />
              </Button>
            </div>
          </div>
          <div className="d-flex gap-2 overflow-auto py-2">
            {images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${product.productname} - View ${i + 1}`}
                className={`thumbnail ${mainImage === i ? "active" : ""}`}
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
                onClick={() => setMainImage(i)}
              />
            ))}
          </div>
        </Col>

        <Col lg={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="fw-bold">{product.productname}</h2>
              <div className="text-muted mb-2">
                <strong>Brand:</strong> {product.productbrand} | 
                <strong> Category:</strong> {product.productcategory}
              </div>
              <Badge bg={stockStatus.variant}>{stockStatus.text}</Badge>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className="text-danger mb-0">{formatPrice(product.price)}</h3>
              {product.oldPrice && (
                <small className="text-muted text-decoration-line-through">
                  {formatPrice(product.oldPrice)}
                </small>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <Row className="align-items-center">
                <Col md={6}>
                  <Form.Group controlId="qty">
                    <Form.Label className="fw-bold">Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={product.stockcount}
                      value={qty}
                      onChange={handleQuantityChange}
                      style={{ width: "100px" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mt-3 mt-md-0">
                  <div className="d-grid gap-2">
                    <Button
                      onClick={addToCartHandler}
                      variant="outline-primary"
                      disabled={product.stockcount <= 0}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={buyNowHandler}
                      variant="primary"
                      disabled={product.stockcount <= 0}
                    >
                      <FaBolt className="me-2" />
                      Buy Now
                    </Button>
                  </div>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className="fw-bold mb-3">Product Description</h5>
              <p className="text-secondary">{product.productinfo}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <small className="text-muted">
                Last updated: 2025-06-16 19:47:36
                <br />
                By: gps-rajput
              </small>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;