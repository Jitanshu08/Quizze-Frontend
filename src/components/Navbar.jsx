import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ onCreateQuiz }) => {
  // Accept onCreateQuiz as a prop
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token after logout:", localStorage.getItem("token")); // Should be null
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar">
      <div className="logo">
        <h1>QUIZZIE</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
          <li>
            {/* Call the onCreateQuiz function when the link is clicked */}
            <a href="#" onClick={onCreateQuiz}>
              Create Quiz
            </a>
          </li>
        </ul>
      </nav>
      <div className="logout">
        <button onClick={handleLogout}>LOGOUT</button>
      </div>
    </div>
  );
};

export default Navbar;
