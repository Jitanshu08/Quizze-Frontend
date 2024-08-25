import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/analytics.css";

function AnalyticsPage() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token"); 

        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://localhost:5000/api/quizzes/my-quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="analytics-container">
      <div className="navbar">
        <div className="logo">
          <h1>QUIZZIE</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#" className="active">
                Analytics
              </a>
            </li>
            <li>
              <a href="#">Create Quiz</a>
            </li>
          </ul>
        </nav>
        <div className="logout">
          <a href="#">LOGOUT</a>
        </div>
      </div>
      <div className="analytics-content">
        <h2>Quiz Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th>Actions</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                <td>{quiz.impressions}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                  <button>Share</button>
                </td>
                <td>
                  <a href="#">Question Wise Analysis</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="add-more-text">{"{more quiz can be added}"}</p>
      </div>
    </div>
  );
}

export default AnalyticsPage;
