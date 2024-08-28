import React from "react";
import { useLocation } from "react-router-dom";
import "../css/quizCompletionPage.css";
import trophyImage from "../assets/trophy.png";

const QuizCompletionPage = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state || {
    score: 0,
    totalQuestions: 0,
  };

  return (
    <div className="quiz-completion-container">
      <h2>Congrats, Quiz is completed</h2>
      <img src={trophyImage} alt="Trophy" className="trophy-image" />
      <h3>
        Your Score is{" "}
        <span className="score" style={{ color: "#28a745" }}>
          {score}/{totalQuestions}
        </span>
      </h3>
    </div>
  );
};

export default QuizCompletionPage;
