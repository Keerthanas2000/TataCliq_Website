import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist } from "./actions/CartActions";

function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const handleRemoveItem = (item) => {
    dispatch(removeFromWishlist(item));
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      {wishlistItems?.length > 0 ? (
        <div className="row" style={{ marginTop: "120px" }}>
          <div className="col-12">
            <h4 className="mb-4 fw-bold">My Wishlist</h4>
            <div className="card mb-3 p-3">
              {wishlistItems.map((item) => (
                <div key={item._id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : "/images/fallback.jpg"}
                      alt={item.title || "Product"}
                      className="me-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <div className="mb-1">
                        <small className="text-muted">Brand: {item.brand || "N/A"}</small>
                      </div>
                      <div className="mb-1">
                        <small className="text-muted">Description: {item.description || "No description available"}</small>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <span className="text-danger fw-bold">
                            ₹{item.price.toFixed(2)}
                          </span>
                          <span className="text-decoration-line-through text-muted ms-2">
                            ₹{(item.price * 1.25).toFixed(2)}
                          </span>
                          <span className="text-success ms-2">
                            {Math.round((1 - item.price / (item.price * 1.25)) * 100)}% Off
                          </span>
                        </div>
                      </div>
                  
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleRemoveItem(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="row" style={{ marginTop: "120px" }}>
          <div className="text-center py-5">
            <h4 className="mb-3">Your wishlist is empty!</h4>
            <p className="text-muted mb-4">Add some items to your wishlist!</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;