import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NotFound = () => {
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <h1 className="display-1 fw-bold text-primary">404</h1>

            <h3 className="fw-semibold mb-3">Page Not Found</h3>

            <p className="text-muted text-center mb-4" style={{ maxWidth: "450px" }}>
                The page you're looking for doesn’t exist or was moved.
                Please check the URL or return to the homepage.
            </p>

            <a href="/" className="btn btn-primary px-4">
                Back to Home
            </a>
        </div>
    );
};

export default NotFound;
