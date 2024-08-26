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

  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors on input change
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
        console.log("User logged in:", response.data);

        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);

        alert("Login successful!");

        setIsLoggedIn(true); // Set login status to true
      } catch (error) {
        console.error("Error during login:", error.response.data);
        alert("Login failed. Please check your credentials and try again.");
      }
    }
  };

  // Use useEffect to navigate after login
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="form-container">
      <h1>QUIZZIE</h1>
      <div className="form-switch">
        <Link to="/signup">
          <button className={location.pathname === "/signup" ? "active" : ""}>
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button className={location.pathname === "/login" ? "active" : ""}>
            Log In
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error-input" : ""}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
