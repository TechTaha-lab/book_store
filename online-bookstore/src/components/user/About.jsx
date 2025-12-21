import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="py-5 text-white" style={{ background: "#0d6efd" }}>
        <div className="container text-center">
          <h1 className="fw-bold mb-3">About Our Bookstore</h1>
          <p className="lead">
            Your trusted online destination for books, knowledge, and inspiration.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container my-5">
        <div className="row align-items-center">

          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
              alt="Books"
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold mb-3">Who We Are</h2>
            <p className="text-muted">
              We are an innovative online bookstore created for passionate readers,
              students, and knowledge seekers. Our platform helps users discover their
              next favorite book through a smooth and enjoyable shopping experience.
            </p>

            <p className="text-muted">
              From technology and science to fiction and personal development — we
              strive to offer a diverse and high-quality collection available 24/7.
            </p>
          </div>

        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4">Our Vision & Mission</h2>

        <div className="row g-4">

          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="fw-bold">🎯 Our Mission</h4>
                <p className="text-muted mb-0">
                  To provide easy access to books worldwide through a user-friendly, 
                  secure, and fast online platform. We aim to make reading simple, enjoyable,
                  and accessible for everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h4 className="fw-bold">🌍 Our Vision</h4>
                <p className="text-muted mb-0">
                  To inspire millions of readers globally by offering a digital bookstore
                  where imagination meets convenience — empowering learning, creativity,
                  and personal growth.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Choose Us?</h2>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">📚 Wide Collection</h5>
                  <p className="text-muted">
                    Thousands of books across different categories tailored to all readers.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">⚡ Fast & Easy</h5>
                  <p className="text-muted">
                    Clean interface and smooth experience for quick book discovery and ordering.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">🔒 Secure Checkout</h5>
                  <p className="text-muted">
                    Enjoy safe payment options and reliable customer support.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4">
            <a href="/book" className="btn btn-primary px-4">
              Start Exploring Books
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
