import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../apiURL"; // ✅ make sure file is apiURL.jsx or apiURL.js

const Book = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState(""); // ⭐ popup message

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiURL}/books`);
      const data = await res.json();
      setBooks(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/book/${id}`);
  };

  const handleAddToCart = async (book) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("You must be logged in to add to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${apiURL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          book_id: book.book_id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await res.json();
      console.log("Cart response:", data);

      setCartMessage("Book added to cart ✅");
      setTimeout(() => setCartMessage(""), 3000); // hide after 3s
    } catch (err) {
      console.error(err);
      setCartMessage("Failed to add to cart. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">Our Books</h2>

        {/* ⭐ Popup message */}
        {cartMessage && (
          <div
            className="alert alert-success alert-dismissible fade show text-center"
            role="alert"
          >
            {cartMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setCartMessage("")}
            ></button>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"></div>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && !error && (
          <div className="row g-4">
            {books.length > 0 ? (
              books.map((book) => (
                <div className="col-md-4" key={book.book_id}>
                  <div className="card shadow-sm h-100">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="card-img-top"
                      style={{ height: "300px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="text-muted">By {book.author}</p>
                      <h6 className="text-primary fw-bold">
                        ${Number(book.price).toFixed(2)}
                      </h6>

                      <div className="mt-auto">
                        <button
                          className="btn btn-outline-primary w-100 mt-3"
                          onClick={() => handleViewDetails(book.book_id)}
                        >
                          View Details
                        </button>

                        <button
                          className="btn btn-primary w-100 mt-2"
                          onClick={() => handleAddToCart(book)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-100 py-4">
                <p>No books available right now.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Book;
