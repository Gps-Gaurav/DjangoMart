import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { addToCart } from '../actions/cartActions';
import Message from '../components/Message';
import { toast } from 'react-toastify';

const AllProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});

  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  // Fetch products only once when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const { data } = await axios.get('/api/products/');

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          // Initialize quantities for new products
          const newQuantities = {};
          data.products.forEach(product => {
            newQuantities[product._id] = 1;
          });
          setQuantities(prev => ({...prev, ...newQuantities}));
        } else {
          setProducts([]);
          setError('Unexpected data format from API');
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Update quantities when cart items change
  useEffect(() => {
    const cartQuantities = {};
    cartItems.forEach(item => {
      cartQuantities[item.product] = item.qty;
    });
    setQuantities(prev => ({...prev, ...cartQuantities}));
  }, [cartItems]);

  const handleQuantityChange = (productId, value) => {
    const qty = parseInt(value);
    if (qty > 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: qty
      }));
    }
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    if (product.stockcount < quantity) {
      toast.error('Product is out of stock or requested quantity exceeds stock!');
      return;
    }
    dispatch(addToCart(product._id, quantity));
    toast.success('Product added to cart successfully!');
  };

  const getStockStatus = (stockcount) => {
    if (stockcount > 10) {
      return <span className="text-success">In Stock ({stockcount})</span>;
    } else if (stockcount > 0) {
      return <span className="text-warning">Low Stock ({stockcount} left)</span>;
    } else {
      return <span className="text-danger">Out of Stock</span>;
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">All Products</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading products...</p>
        </div>
      )}

      {error && (
        <Message variant="danger">{error}</Message>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-muted">No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={product.image || '/images/placeholder.png'}
                  className="card-img-top"
                  alt={product.productname}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.productname}</h5>
                  <p className="card-text mb-1">
                    <strong>Brand:</strong> {product.productbrand || 'N/A'}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Category:</strong> {product.productcategory || 'N/A'}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> ₹{product.price || 'N/A'}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Status:</strong>{' '}
                    {getStockStatus(product.stockcount)}
                  </p>

                  {product.stockcount > 0 && (
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <Form.Label className="mb-0">Qty:</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max={product.stockcount}
                          value={quantities[product._id] || 1}
                          onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                          style={{ width: '80px' }}
                          className="form-control-sm"
                        />
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        variant={isInCart(product._id) ? "success" : "secondary"}
                        className="w-100"
                        disabled={product.stockcount === 0}
                      >
                        {isInCart(product._id) ? (
                          <>
                            <i className="fas fa-check me-2"></i>
                            In Cart
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shopping-cart me-2"></i>
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {product.stockcount === 0 && (
                    <Button
                      variant="secondary"
                      className="w-100"
                      disabled
                    >
                      Out of Stock
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProductsScreen;