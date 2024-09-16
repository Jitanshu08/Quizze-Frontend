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

    // Clear the error when the user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2,6})?$/;

    if (!formData.username) newErrors.username = "Invalid name";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid Email format";
    }
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
        const { username, email, password } = formData;
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          { username, email, password }
        );
        alert("Registration successful!");
        navigate("/login");
      } catch (error) {
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
            onFocus={handleFocus}
            className={errors.username ? "signup-error-input" : ""}
            placeholder={errors.username || ""}
          />
        </div>

        <div className="signup-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            className={errors.email ? "signup-error-input" : ""}
            placeholder={errors.email || ""}
          />
        </div>
        <div className="signup-form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            className={errors.password ? "signup-error-input" : ""}
            placeholder={errors.password || ""}
          />
        </div>
        <div className="signup-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={handleFocus}
            className={errors.confirmPassword ? "signup-error-input" : ""}
            placeholder={errors.confirmPassword || ""}
          />
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
