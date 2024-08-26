import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import CreateQuizModal from "../components/CreateQuizModal"; // Import the CreateQuizModal component

const DashboardPage = () => {
  const [quizData, setQuizData] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
    trendingQuizzes: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quizzes/dashboard-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
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

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleContinue = (quizName, quizType) => {
    console.log("Quiz Name:", quizName);
    console.log("Quiz Type:", quizType);
    setIsModalOpen(false);
    // Proceed with the next steps (e.g., quiz creation form based on the selected type)
  };

  return (
    <div className="dashboard">
      <Navbar onCreateQuiz={handleOpenModal} /> {/* Pass the function as a prop */}
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
      {isModalOpen && (
        <CreateQuizModal onClose={handleCloseModal} onContinue={handleContinue} />
      )}
    </div>
  );
};

export default DashboardPage;
