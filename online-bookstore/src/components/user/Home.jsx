import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row align-items-center">

                        {/* Text */}
                        <div className="col-md-6">
                            <h1 className="display-5 fw-bold mb-3">
                                Welcome to <span className="text-primary">Online Bookstore</span>
                            </h1>
                            <p className="lead text-muted mb-4">
                                Discover, explore, and buy your favorite books from the comfort of your home.
                                A simple and modern online bookstore made for book lovers.
                            </p>
                            <div className="d-flex gap-2">
                                <a href="/book" className="btn btn-primary">
                                    Browse Books
                                </a>
                                <a href="/register" className="btn btn-outline-primary">
                                    Create Account
                                </a>
                            </div>
                        </div>

                        {/* Image / Illustration */}
                        <div className="col-md-6 text-center mt-4 mt-md-0">
                            <img
                                src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                                alt="Books and reading"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: "300px", objectFit: "cover" }}
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-4">Why Shop With Us?</h2>
                    <div className="row g-4">

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Wide Selection</h5>
                                    <p className="card-text text-muted">
                                        Choose from different categories including programming, fiction,
                                        self-development, and more.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Easy to Use</h5>
                                    <p className="card-text text-muted">
                                        Simple and clean design so you can quickly find and order the books you love.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Secure & Fast</h5>
                                    <p className="card-text text-muted">
                                        Secure checkout (later with payments) and a smooth user experience for all customers.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="py-5 bg-primary text-white">
                <div className="container text-center">
                    <h3 className="mb-3">Ready to start reading?</h3>
                    <p className="mb-4">
                        Create an account and explore our collection of books right now.
                    </p>
                    <a href="/register" className="btn btn-light px-4">
                        Get Started
                    </a>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
