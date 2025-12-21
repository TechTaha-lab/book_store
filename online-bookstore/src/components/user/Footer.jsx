import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 pt-4 pb-3">
      <div className="container">

        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-3">
            <h4 className="fw-bold">OnlineBookstore</h4>
            <p className="text-muted">
              Your favorite place to discover new books, learn, and grow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white-50 text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-white-50 text-decoration-none">About</a></li>
              <li><a href="/book" className="text-white-50 text-decoration-none">Books</a></li>
              <li><a href="/contact" className="text-white-50 text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Contact</h5>
            <p className="text-white-50 mb-1">Email: support@onlinebookstore.com</p>
            <p className="text-white-50 mb-1">Phone: +1 234 567 890</p>
            <p className="text-white-50">Address: Beirut, Lebanon</p>
          </div>

        </div>

        <hr className="border-secondary" />

        {/* Copyright */}
        <p className="text-center text-white-50 mb-0">
          © {new Date().getFullYear()} OnlineBookstore — All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
