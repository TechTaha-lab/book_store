import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminNavbar = () => {

    const handleLogout = () => {
        localStorage.clear();            // remove all user data
        window.location.href = "/login"; // redirect
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">

                <a className="navbar-brand fw-bold" href="/admin/dashboard">
                    Admin Panel
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#adminNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="adminNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <a className="nav-link" href="/admin/dashboard">Dashboard</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/admin/books">Manage Books</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/admin/users">Manage Users</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/admin/orders">Orders</a>
                        </li>

                    </ul>

                    <div className="d-flex">
                        <button className="btn btn-outline-light" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
