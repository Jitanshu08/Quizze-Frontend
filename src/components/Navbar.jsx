import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "dashboard-nav-link active" : "dashboard-nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? "dashboard-nav-link active" : "dashboard-nav-link"
              }
            >
              Analytics
            </NavLink>
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
