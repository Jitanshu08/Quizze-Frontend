import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/liveQuizInterface.css";

const LiveQuizInterface = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`
        );
        setQuizData(response.data);

        if (response.data.questions[0].timer) {
          setTimer(response.data.questions[0].timer);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      handleNextOrSubmit();
    }
  }, [timer]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNextOrSubmit = async () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    let updatedScore = score;

    try {
      if (selectedOption !== null) {
        if (
          quizData.quizCategory === "Q&A" &&
          selectedOption === currentQuestion.correctOption
        ) {
          updatedScore += 1;
          setScore(updatedScore);
        }

        await axios.post(
          `http://localhost:5000/api/quizzes/response/${quizId}`,
          {
            answers: [
              {
                question: currentQuestion._id,
                selectedOption,
              },
            ],
          }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/quizzes/response/${quizId}`,
          {
            answers: [
              {
                question: currentQuestion._id,
                selectedOption: -1,
              },
            ],
          }
        );
      }

      if (currentQuestionIndex + 1 < quizData.questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOption(null);
        const nextQuestion = quizData.questions[currentQuestionIndex + 1];
        if (nextQuestion.timer) {
          setTimer(nextQuestion.timer);
        } else {
          setTimer(null);
        }
      } else {
        if (quizData.quizCategory === "Q&A") {
          navigate("/quiz-completion", {
            state: {
              score: updatedScore,
              totalQuestions: quizData.questions.length,
            },
          });
        } else {
          navigate("/poll-completion");
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("There was an issue submitting your answer. Please try again.");
    }
  };

  const formatNumber = (number) => {
    return number < 10 ? `0${number}` : number;
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-screen-wrapper">
      <div className="live-quiz-container">
        <div className="question-header">
          <span className="question-index">
            {`${formatNumber(currentQuestionIndex + 1)}/${formatNumber(quizData.questions.length)}`}
          </span>
          {timer !== null && <span className="timer">{`00:${timer}s`}</span>}
        </div>
        <div className="question-container">
          <h3>{quizData.questions[currentQuestionIndex].text}</h3>
          <div className="options-container">
            {quizData.questions[currentQuestionIndex].options.map((option, index) => (
              <div
                key={index}
                className={`option ${selectedOption === index ? "selected" : ""}`}
                onClick={() => handleOptionSelect(index)}
              >
                {quizData.questions[currentQuestionIndex].optionType === "Text" && option.text}
                {quizData.questions[currentQuestionIndex].optionType === "Image URL" && (
                  <img src={option.imageUrl} alt={`Option ${index + 1}`} />
                )}
                {quizData.questions[currentQuestionIndex].optionType === "Text & Image URL" && (
                  <div className="text-image-option">
                    <span>{option.text}</span>
                    <img src={option.imageUrl} alt={`Option ${index + 1}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="quiz-button" onClick={handleNextOrSubmit} disabled={selectedOption === null}>
            {currentQuestionIndex + 1 === quizData.questions.length ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizInterface;
