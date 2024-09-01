import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/editQuizModal.css";

const EditQuizModal = ({ quiz, onClose, onSave }) => {
  const [questions, setQuestions] = useState(quiz?.questions || []);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (quiz && quiz.questions) {
      setQuestions(quiz.questions);
    }
  }, [quiz]);

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].text = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e, field) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleTimerChange = (index, time) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = time === "off" ? 0 : parseInt(time);
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    const updatedQuiz = {
      ...quiz,
      questions,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/quizzes/${quiz._id}`,
        updatedQuiz,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving edited quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  if (!quiz) {
    return null; // Prevent rendering if quiz prop is missing
  }

  return (
    <div className="edit-quiz-modal-overlay">
      <div className="edit-quiz-modal-content">
        <h2>Edit Quiz</h2>
        <div className="edit-quiz-question-navigation">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveQuestionIndex(index)}
              className={`edit-quiz-question-button ${
                activeQuestionIndex === index ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="edit-quiz-question-group">
          <input
            type="text"
            value={questions[activeQuestionIndex]?.text || ""}
            onChange={(e) => handleQuestionChange(activeQuestionIndex, e)}
            className="edit-quiz-modal-input"
          />
          {questions[activeQuestionIndex]?.options.map((option, oIndex) => (
            <div
              key={oIndex}
              className={`edit-quiz-option-group ${
                questions[activeQuestionIndex].correctOption === oIndex
                  ? "edit-quiz-correct-option"
                  : ""
              }`}
            >
              {questions[activeQuestionIndex].optionType === "Text" ||
              questions[activeQuestionIndex].optionType ===
                "Text & Image URL" ? (
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(activeQuestionIndex, oIndex, e, "text")
                  }
                  placeholder={`Text ${oIndex + 1}`}
                  className="text-input"
                />
              ) : null}
              {questions[activeQuestionIndex].optionType === "Image URL" ||
              questions[activeQuestionIndex].optionType ===
                "Text & Image URL" ? (
                <input
                  type="text"
                  value={option.imageUrl}
                  onChange={(e) =>
                    handleOptionChange(
                      activeQuestionIndex,
                      oIndex,
                      e,
                      "imageUrl"
                    )
                  }
                  placeholder={`Image URL ${oIndex + 1}`}
                  className="image-input"
                />
              ) : null}
            </div>
          ))}
          <div className="edit-quiz-timer-group">
            <label className="edit-quiz-modal-label">Timer:</label>
            <button
              className={`${
                questions[activeQuestionIndex].timer === 0 ? "active" : ""
              }`}
              onClick={() => handleTimerChange(activeQuestionIndex, "off")}
            >
              OFF
            </button>
            <button
              className={`${
                questions[activeQuestionIndex].timer === 5 ? "active" : ""
              }`}
              onClick={() => handleTimerChange(activeQuestionIndex, "5")}
            >
              5 sec
            </button>
            <button
              className={`${
                questions[activeQuestionIndex].timer === 10 ? "active" : ""
              }`}
              onClick={() => handleTimerChange(activeQuestionIndex, "10")}
            >
              10 sec
            </button>
          </div>
        </div>
        <div className="edit-quiz-modal-actions">
          <button className="edit-quiz-modal-button" onClick={onClose}>
            Cancel
          </button>
          <button className="edit-quiz-modal-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuizModal;
