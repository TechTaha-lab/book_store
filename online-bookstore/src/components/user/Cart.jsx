import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../apiURL";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("You must be logged in to view your cart");
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiURL}/cart/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await res.json();
        setCartItems(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/payment");
  };

  const handleRemove = async (bookId) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${apiURL}/cart/${userId}/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems((prev) =>
        prev.filter((item) => item.book_id !== bookId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from cart.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">Your Cart</h2>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"></div>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && !error && (
          <>
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <h4>Your cart is empty</h4>
                <a href="/book" className="btn btn-primary mt-3">
                  Browse Books
                </a>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-8">
                  <div className="list-group">
                    {cartItems.map((item) => (
                      <div
                        className="list-group-item d-flex align-items-center"
                        key={item.cart_id}
                      >
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />

                        <div className="ms-3 flex-grow-1">
                          <h5 className="mb-1">{item.title}</h5>
                          <p className="mb-1 text-muted">
                            ${Number(item.price).toFixed(2)}
                          </p>

                          <div className="d-flex align-items-center">
                            <label className="me-2">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              readOnly
                              className="form-control"
                              style={{ width: "80px" }}
                            />
                          </div>
                        </div>

                        <button
                          className="btn btn-danger ms-3"
                          onClick={() => handleRemove(item.book_id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow p-3">
                    <h4 className="mb-3">Order Summary</h4>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Items:</span>
                      <strong>{cartItems.length}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Price:</span>
                      <strong>${total.toFixed(2)}</strong>
                    </div>

                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>

                    <a
                      href="/book"
                      className="btn btn-outline-secondary w-100 mt-2"
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
