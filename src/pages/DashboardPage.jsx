import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import CreateQuizModal from "../components/CreateQuizModal";
import "../css/dashboard.css"; 

const DashboardPage = () => {
  const [quizData, setQuizData] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
    trendingQuizzes: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quizzes/dashboard-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContinue = (quizName, quizType) => {
    console.log("Quiz Name:", quizName);
    console.log("Quiz Type:", quizType);
    setIsModalOpen(false);
    
  };

  return (
    <div className="dashboard-page">
      <Navbar onCreateQuiz={handleOpenModal} />
      <div className="dashboard-page-content">
        <div className="dashboard-stats">
          <div className="dashboard-stat-box">
            <h3>{quizData.totalQuizzes}</h3>
            <p>Quizzes Created</p>
          </div>
          <div className="dashboard-stat-box">
            <h3>{quizData.totalQuestions}</h3>
            <p>Questions Created</p>
          </div>
          <div className="dashboard-stat-box">
            <h3>{quizData.totalImpressions}</h3>
            <p>Total Impressions</p>
          </div>
        </div>
        <div className="dashboard-trending-quizzes">
          <h2>Trending Quizzes</h2>
          <ul>
            {quizData.trendingQuizzes.length > 0 ? (
              quizData.trendingQuizzes.map((quiz, index) => (
                <li key={index}>
                  <h3>{quiz.title}</h3>
                  <p>
                    Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  <p>{quiz.impressions}</p>
                </li>
              ))
            ) : (
              <p>No trending quizzes available.</p>
            )}
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <CreateQuizModal
          onClose={handleCloseModal}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default DashboardPage;
