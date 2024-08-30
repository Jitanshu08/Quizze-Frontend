import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ onCreateQuiz }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token after logout:", localStorage.getItem("token"));
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-navbar">
      <div className="dashboard-logo">
        <h1>QUIZZIE</h1>
      </div>
      <nav className="dashboard-nav">
        <ul className="dashboard-nav-list">
          <li className="dashboard-nav-item">
            <Link to="/dashboard" className="dashboard-nav-link">Dashboard</Link>
          </li>
          <li className="dashboard-nav-item">
            <Link to="/analytics" className="dashboard-nav-link">Analytics</Link>
          </li>
          <li className="dashboard-nav-item">
            <a href="#" onClick={onCreateQuiz} className="dashboard-nav-link">
              Create Quiz
            </a>
          </li>
        </ul>
      </nav>
      <div className="dashboard-logout">
        <button onClick={handleLogout} className="dashboard-logout-button">
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Navbar;
