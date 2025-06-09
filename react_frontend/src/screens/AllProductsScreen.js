import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllProductsScreen = () => {
  const [products, setProducts] = useState([]); // products array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await axios.get('/api/products/');

      // Access products array inside data
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
        setError('Unexpected data format from API');
      }

      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.detail
          ? err.response.data.detail
          : err.message
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>All Products</h1>

      {loading && <p>Loading products...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading && !error && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h2>{product.productname}</h2>
              <p>Brand: {product.productbrand || 'N/A'}</p>
              <p>Category: {product.productcategory || 'N/A'}</p>
              <p>Price: ₹{product.price || 'N/A'}</p>
              <p>Stock: {product.stockcount > 0 ? 'In stock' : 'Out of stock'}</p>
              <img
                src={product.image || '/images/placeholder.png'}
                alt={product.productname}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllProductsScreen;
