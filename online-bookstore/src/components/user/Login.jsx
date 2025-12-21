import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiURL } from "../apiURL.JSX";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- IMPORTANT

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      setSuccess("Login successful!");

      // Save to localStorage
      localStorage.setItem("user_id", data.user.user_id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("user_role", data.user.user_role);

      // VERY IMPORTANT → update global context
      login(data.user);

      // Redirect based on role
      setTimeout(() => {
        if (Number(data.user.user_role) === 1) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 700);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="col-md-4">
        <div className="card shadow p-4">

          <h3 className="text-center mb-3">Login</h3>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <button
              className="btn btn-primary w-100 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Checking...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <a href="/register" className="text-primary">
                Register
              </a>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
