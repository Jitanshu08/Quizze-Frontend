import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Invalid Email";
    if (!formData.password) newErrors.password = "Invalid Password";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          formData
        );

        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error during login:", error.response.data);
        alert("Login failed. Please check your credentials and try again.");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login-page-background">
      <div className="login-form-container">
        <h1>QUIZZIE</h1>
        <div className="login-form-switch">
          <Link to="/signup">
            <button
              className={location.pathname === "/signup" ? "login-active" : ""}
            >
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button
              className={location.pathname === "/login" ? "login-active" : ""}
            >
              Log In
            </button>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.email ? "login-error-input" : ""}
              placeholder={errors.email || ""}
            />
          </div>
          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.password ? "login-error-input" : ""}
              placeholder={errors.password || ""}
            />
          </div>
          <button type="submit" className="login-submit-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
