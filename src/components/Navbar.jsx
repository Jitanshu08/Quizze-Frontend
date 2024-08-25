import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
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
            <Link to="/create-quiz">Create Quiz</Link>
          </li>
        </ul>
      </nav>
      <div className="logout">
        <Link to="/logout">LOGOUT</Link>
      </div>
    </div>
  );
};

export default Navbar;
