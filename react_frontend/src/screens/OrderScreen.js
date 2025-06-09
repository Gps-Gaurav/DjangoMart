import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../actions/orderActions';
import { useParams } from 'react-router-dom';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.orderDetails || {});

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Order #{orderId}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="border p-4 rounded-md shadow">
          <p><strong>Product:</strong> {order.productname || 'N/A'}</p>
          <p><strong>Price:</strong> ₹{order.price}</p>
          <p><strong>Status:</strong> {order.status || 'Pending'}</p>
          {/* Add more order details here */}
        </div>
      )}
    </div>
  );
};

export default OrderScreen;
