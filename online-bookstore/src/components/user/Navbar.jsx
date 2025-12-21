import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    const uname = localStorage.getItem("username");

    if (uid) {
      setLoggedIn(true);
      setUsername(uname || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">

        <a className="navbar-brand fw-bold" href="/">
          OnlineBookstore
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/book">Books</a>
            </li>

            {loggedIn && (
              <li className="nav-item">
                <a className="nav-link" href="/cart">Cart</a>
              </li>
            )}

            <li className="nav-item">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
          </ul>

          <div className="d-flex gap-2">
            {loggedIn ? (
              <>
                <span className="navbar-text me-2 fw-semibold">
                  Hello, {username}
                </span>

                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn btn-outline-primary">
                  Sign In
                </a>
                <a href="/register" className="btn btn-primary">
                  Sign Up
                </a>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
