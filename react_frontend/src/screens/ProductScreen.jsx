import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productsActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = () => {
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const formatPrice = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product || !product.productname) return <Message variant="danger">Product not found</Message>;

  const images = [
    product.image,
 ];

  return (
    <div className="container my-5">
      <div className="row gx-5">
        <div className="col-lg-6">
          <div
            className="border rounded p-3 mb-3 d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <img
              src={images[mainImage]} alt="img"
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
          <div className="d-flex gap-2 overflow-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className={`img-thumbnail ${mainImage === i ? "border-primary" : ""}`}
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
                onClick={() => setMainImage(i)}
              />
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <h2 className="fw-bold">{product.productname}</h2>
          <p className="text-muted mb-1">
            <strong>Brand:</strong> {product.productbrand} | <strong>Category:</strong> {product.productcategory}
          </p>

          <div className="my-3">
            <h3 className="text-danger d-inline-block me-3">{formatPrice(product.price)}</h3>
            <span className={`badge ms-3 ${product.stockcount > 0 ? "bg-success" : "bg-danger"}`}>
              {product.stockcount > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 my-4 flex-wrap">
            <label htmlFor="qty" className="form-label mb-0 fw-semibold">
              Quantity:
            </label>
            <input
              type="number"
              id="qty"
              className="form-control"
              style={{ width: "80px" }}
              min={1}
              max={product.stockcount}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <button
              className="btn btn-warning text-white flex-grow-1"
              onClick={addToCartHandler}
              disabled={product.stockcount <= 0}
            >
              Add to Cart
            </button>
            <button className="btn btn-danger flex-grow-1">Buy Now</button>
          </div>

          <div>
            <h5 className="fw-semibold">Description</h5>
            <p className="text-secondary">{product.productinfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;