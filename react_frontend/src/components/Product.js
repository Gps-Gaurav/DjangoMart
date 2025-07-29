import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Product({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="h-100 shadow-sm product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img
          variant="top"
          src={product.image}
          alt={`${product.productname} by ${product.productbrand}`}
          className="img-fluid product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="h5" className="text-dark product-title">
            {product.productname}
          </Card.Title>
        </Link>

        <div className="mt-auto">
          <Card.Text className="mb-2 text-muted">
            {product.productbrand}
          </Card.Text>
          <Card.Text className="text-success fw-bold">
            {formatPrice(product.price)}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    productname: PropTypes.string.isRequired,
    productbrand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default Product;
