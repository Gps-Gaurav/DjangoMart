import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}/`);

    if (!data.product) {
      throw new Error('Product data not found in response');
    }

    const productData = data.product;

    // Validate stock
    if (productData.stockcount < qty) {
      toast.error('Selected quantity exceeds available stock');
      return;
    }

    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: productData._id,
        productname: productData.productname,
        image: productData.image,
        price: productData.price,
        stockcount: productData.stockcount,
        qty,
        timestamp: data.timestamp,
        addedBy: data.current_user || 'guest',
      },
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    toast.success(`${productData.productname} added to cart`);

  } catch (error) {
    const errorMessage = 
      error.response?.data?.detail ||
      error.message ||
      'Error adding item to cart';
    
    toast.error(errorMessage);
    console.error('Add to cart error:', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      productId: id,
      quantity: qty
    });
  }
};

export const removeFromCart = (id) => (dispatch, getState) => {
  try {
    // Find item before removing to show in success message
    const cartItem = getState().cart.cartItems.find(x => x.product === id);
    
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: id,
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    
    if (cartItem) {
      toast.success(`${cartItem.productname} removed from cart`);
    }

  } catch (error) {
    toast.error('Error removing item from cart');
    console.error('Remove from cart error:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      productId: id
    });
  }
};

export const saveShippingAddress = (data) => (dispatch) => {
  try {
    // Validate required fields
    const requiredFields = ['address', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS,
      payload: {
        ...data,
        timestamp: new Date().toISOString(),
        updatedBy: 'gps-rajput' // Current user's login
      },
    });

    localStorage.setItem('shippingAddress', JSON.stringify(data));
    toast.success('Shipping address saved successfully');

  } catch (error) {
    toast.error('Error saving shipping address');
    console.error('Save shipping address error:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      data
    });
  }
};

export const savePaymentMethod = (data) => (dispatch) => {
  try {
    if (!data) {
      toast.error('Please select a payment method');
      return;
    }

    dispatch({
      type: CART_SAVE_PAYMENT_METHOD,
      payload: {
        method: data,
        timestamp: new Date().toISOString(),
        updatedBy: 'gps-rajput' // Current user's login
      },
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
    toast.success(`Payment method set to ${data}`);

  } catch (error) {
    toast.error('Error saving payment method');
    console.error('Save payment method error:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      method: data
    });
  }
};