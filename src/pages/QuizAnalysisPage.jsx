import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/quizAnalysis.css";

const QuizAnalysisPage = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [analysisData, setAnalysisData] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz data: ", error);
      }
    };

    const fetchAnalysisData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/quizzes/analysis/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAnalysisData(response.data);
      } catch (error) {
        console.error("Error fetching analysis data: ", error);
      }
    };

    fetchQuizData();
    fetchAnalysisData();
  }, [quizId]);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const dateParts = new Date(date)
      .toLocaleDateString("en-GB", options)
      .split(" ");
    return `${dateParts[0]} ${dateParts[1]}, ${dateParts[2]}`;
  };

  return (
    <div className="quiz-analysis-wrapper">
      <Navbar />
      <div className="quiz-analysis-container">
        <div className="quiz-analysis-content">
          {quizData && (
            <>
              <h2>{quizData.title} Question Analysis</h2>
              <div className="quiz-metadata">
                <p>Created on: {formatDate(quizData.createdAt)}</p>
                <p>Impressions: {quizData.impressions}</p>
              </div>
            </>
          )}
          <div className="analysis-section">
            {analysisData.map((analysis, index) => (
              <div key={index} className="analysis-item">
                <h3>
                  Q.{index + 1} {analysis.question}
                </h3>
                <div
                  className={`analysis-stats ${
                    quizData.quizCategory === "Poll" ? "poll-type" : ""
                  }`}
                >
                  {quizData.quizCategory === "Q&A" ? (
                    <>
                      <div className="stat-box">
                        <p>{analysis.attempted}</p>
                        <p>people Attempted the question</p>
                      </div>
                      <div className="stat-box">
                        <p>{analysis.correct}</p>
                        <p>people Answered Correctly</p>
                      </div>
                      <div className="stat-box">
                        <p>{analysis.incorrect}</p>
                        <p>people Answered Incorrectly</p>
                      </div>
                    </>
                  ) : (
                    analysis.options.map((optionData, optIndex) => (
                      <div key={optIndex} className="stat-box">
                        <p>{optionData.count}</p>
                        <div className="poll-option">
                          {optionData.option.text && (
                            <span>{optionData.option.text}</span>
                          )}
                          {optionData.option.imageUrl && (
                            <img
                              src={optionData.option.imageUrl}
                              alt={`Option ${optIndex + 1}`}
                              className="poll-option-image"
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalysisPage;
