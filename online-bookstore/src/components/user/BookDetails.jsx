import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { apiURL } from "../apiURL.JSX";

const BookDetails = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${apiURL}/books/${id}`);
        console.log(res);
        
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError("Book not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <h3 className="text-center mt-5">Loading book...</h3>;
  }

  if (error || !book) {
    return <h3 className="text-center mt-5 text-danger">{error}</h3>;
  }

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <div className="row align-items-center">

          <div className="col-md-6">
            <img
              src={book.image_url}
              alt={book.title}
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6">
            <h2>{book.title}</h2>
            <p className="text-muted">By {book.author}</p>

            <h4 className="text-primary fw-bold mb-3">${book.price}</h4>

            <p className="text-secondary">{book.description}</p>

            <button className="btn btn-primary mt-3 w-100">
              Add to Cart
            </button>

            <Link to="/book" className="btn btn-outline-secondary mt-3 w-100">
              Go Back
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookDetails;
