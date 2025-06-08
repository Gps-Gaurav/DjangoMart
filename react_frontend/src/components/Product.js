import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Product({ product }) {
    return (
        <Card className="h-100 shadow-sm">
            <Link to={`/product/${product._id}`}>
                <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.productname}
                    className="img-fluid"
                />
            </Link>

            <Card.Body className="d-flex flex-column">
                <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <Card.Title as="h5" className="text-dark">
                        {product.productname}
                    </Card.Title>
                </Link>

                <div className="mt-auto">
                    <Card.Text className="mb-2 text-muted">
                        {product.productbrand}
                    </Card.Text>
                    <Card.Text className="text-success fw-bold">
                        ${product.price}
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Product;