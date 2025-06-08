import React, { useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productsActions";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { APP_CONSTANTS } from "../../constants/appConstant";

const { CURRENT_TIME, DEFAULT_USER } = APP_CONSTANTS;

function HomeScreen() {
    const dispatch = useDispatch();
    const productsList = useSelector((state) => state.productsList);
    const { error, loading, products } = productsList;

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    return (
        <Container className="py-4">
            <div className="text-center mb-4">
                <h2 className="fw-bold">Shop Top Deals on DjangoMart</h2>
                <Alert variant="info" className="mt-3 mb-0 rounded-pill shadow-sm">
                    🎉 Welcome to DjangoMart! Enjoy exclusive offers on your favorite products!
                </Alert>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Row className="g-4">
                        {products && products.length > 0 ? (
                            products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center">
                                <Message variant="info">No products found.</Message>
                            </Col>
                        )}
                    </Row>
                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Last updated: {CURRENT_TIME} | User: {DEFAULT_USER}
                        </small>
                    </div>
                </>
            )}
        </Container>
    );
}

export default HomeScreen;