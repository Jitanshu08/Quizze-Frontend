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

        // Only set the timer if it's a Q&A quiz
        if (
          response.data.quizCategory === "Q&A" &&
          response.data.questions[0].timer
        ) {
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
      handleNextOrSubmit(); // Automatically move to the next question or submit if it's the last one
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
        // Check if the selected option is correct for Q&A quizzes
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
        // If no option selected or timer ran out, mark as incorrect
        await axios.post(
          `http://localhost:5000/api/quizzes/response/${quizId}`,
          {
            answers: [
              {
                question: currentQuestion._id,
                selectedOption: -1, // Assuming -1 or null signifies an incorrect answer due to timeout
              },
            ],
          }
        );
      }

      if (currentQuestionIndex + 1 < quizData.questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOption(null);
        const nextQuestion = quizData.questions[currentQuestionIndex + 1];
        if (quizData.quizCategory === "Q&A" && nextQuestion.timer) {
          setTimer(nextQuestion.timer);
        } else {
          setTimer(null);
        }
      } else {
        // Navigate to the appropriate completion page with the final score
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

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="live-quiz-container">
      <h2>{quizData.title}</h2>
      <div className="question-container">
        <h3>{quizData.questions[currentQuestionIndex].text}</h3>
        {quizData.quizCategory === "Q&A" && timer !== null && (
          <div className="timer">Time Left: {timer}s</div>
        )}
        <div className="options-container">
          {quizData.questions[currentQuestionIndex].options.map(
            (option, index) => (
              <div
                key={index}
                className={`option ${
                  selectedOption === index ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                {option}
              </div>
            )
          )}
        </div>
        <button onClick={handleNextOrSubmit} disabled={selectedOption === null}>
          {currentQuestionIndex + 1 === quizData.questions.length
            ? "Submit"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default LiveQuizInterface;
