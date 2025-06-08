import React from "react";
import { Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <Card className="my-3 p-2 rounded shadow-sm border-0 product-card" style={{ minHeight: "420px" }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          variant="top"
          className="img-fluid rounded product-img"
        />
      </Link>

      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
            <Card.Title as="h5" className="fw-semibold mb-2">
              {product.productname}
            </Card.Title>
          </Link>

          <div className="mb-2 text-muted small">
            <strong>{product.rating}</strong> from {product.numReviews} reviews
          </div>

          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
            color="#f8e825"
          />

          <Card.Text as="h6" className="mt-2 text-success fw-bold">
            ₹{product.price}
          </Card.Text>
        </div>

        <div className="mt-3">
          <Link to={`/product/${product._id}`}>
            <Button variant="outline-primary" className="w-100">
              More Details
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
