import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/signup.css";

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors on input change
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Invalid name";
    if (!formData.email) newErrors.email = "Invalid Email";
    if (!formData.password) newErrors.password = "Weak password";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          formData
        );
        console.log("User registered:", response.data);
        alert("Registration successful!");
        navigate("/login");
      } catch (error) {
        console.error("Error during registration:", error.response.data);
        alert("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="signup-form-container">
      <h1>QUIZZIE</h1>
      <div className="signup-form-switch">
        <Link to="/signup">
          <button
            className={location.pathname === "/signup" ? "signup-active" : ""}
          >
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button
            className={location.pathname === "/login" ? "signup-active" : ""}
          >
            Log In
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="signup-form-group">
          <label>Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? "signup-error-input" : ""}
          />
          {errors.username && (
            <span className="signup-error-text">{errors.username}</span>
          )}
        </div>

        <div className="signup-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "signup-error-input" : ""}
          />
          {errors.email && (
            <span className="signup-error-text">{errors.email}</span>
          )}
        </div>
        <div className="signup-form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "signup-error-input" : ""}
          />
          {errors.password && (
            <span className="signup-error-text">{errors.password}</span>
          )}
        </div>
        <div className="signup-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "signup-error-input" : ""}
          />
          {errors.confirmPassword && (
            <span className="signup-error-text">{errors.confirmPassword}</span>
          )}
        </div>
        <button
          type="submit"
          className="signup-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign-Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
