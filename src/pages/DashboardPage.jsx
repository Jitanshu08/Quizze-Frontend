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
      .get(`${import.meta.env.VITE_API_URL}/api/quizzes/dashboard-data`, {
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

  const formatImpressions = (impressions) => {
    if (impressions >= 1000) {
      return (impressions / 1000).toFixed(1) + "K";
    }
    return impressions;
  };
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const dateParts = new Date(date)
      .toLocaleDateString("en-GB", options)
      .split(" ");
    return `${dateParts[0]} ${dateParts[1]}, ${dateParts[2]}`;
  };

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
          <div className="dashboard-stat-box quizzes">
            <h3>
              {quizData.totalQuizzes} <span className="first-word">Quiz</span>
            </h3>
            <p>Created</p>
          </div>
          <div className="dashboard-stat-box questions">
            <h3>
              {quizData.totalQuestions}{" "}
              <span className="first-word">questions</span>
            </h3>
            <p>Created</p>
          </div>
          <div className="dashboard-stat-box impressions">
            <h3>
              {formatImpressions(quizData.totalImpressions)}{" "}
              <span className="first-word">Total</span>
            </h3>
            <p>Impressions</p>
          </div>
        </div>
        <div className="dashboard-trending-quizzes">
          <h2>Trending Quizzes</h2>
          <ul>
            {quizData.trendingQuizzes.length > 0 ? (
              quizData.trendingQuizzes.map((quiz, index) => (
                <li key={index}>
                  <div className="quiz-header">
                    <h3>{quiz.title}</h3>
                    <p className="impressions">
                      {formatImpressions(quiz.impressions)}
                    </p>
                  </div>
                  <p className="created-on">
                    Created on: {formatDate(quiz.createdAt)}
                  </p>
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
