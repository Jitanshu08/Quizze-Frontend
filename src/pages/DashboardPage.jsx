import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const DashboardPage = () => {
  const [quizData, setQuizData] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
    trendingQuizzes: [],
  });

  useEffect(() => {
    // Fetch the data from the backend using Axios
    axios
      .get("http://localhost:5000/api/quizzes/dashboard-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Fetches the token from localStorage
        },
      })
      .then((response) => {
        console.log(response.data);
        const {
          totalQuizzes,
          totalQuestions,
          totalImpressions,
          trendingQuizzes,
        } = response.data;
        setQuizData({
          totalQuizzes,
          totalQuestions,
          totalImpressions,
          trendingQuizzes: trendingQuizzes || [], 
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-box">
            <h3>{quizData.totalQuizzes}</h3>
            <p>Quizzes Created</p>
          </div>
          <div className="stat-box">
            <h3>{quizData.totalQuestions}</h3>
            <p>Questions Created</p>
          </div>
          <div className="stat-box">
            <h3>{quizData.totalImpressions}</h3>
            <p>Total Impressions</p>
          </div>
        </div>
        <div className="trending-quizzes">
          <h2>Trending Quizzes</h2>
          <ul>
            {quizData.trendingQuizzes.length > 0 ? (
              quizData.trendingQuizzes.map((quiz, index) => (
                <li key={index}>
                  <h3>{quiz.title}</h3>
                  <p>
                    Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  <p>Impressions: {quiz.impressions}</p>
                </li>
              ))
            ) : (
              <p>No trending quizzes available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
