import React, { useState } from "react";
import "../css/CreateQuizModal.css";
import ShareQuizModal from "./ShareQuizModal"; // Import the new ShareQuizModal component
import axios from "axios";

const CreateQuizModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", ""],
      correctOption: 0,
      timer: "off",
      optionType: "Text",
    },
  ]);
  const [shareLink, setShareLink] = useState(null); // New state to store the share link

  const handleQuizNameChange = (e) => setQuizName(e.target.value);
  const handleQuizTypeChange = (e) => setQuizType(e.target.value);

  const handleCancel = () => {
    onClose();
  };

  const handleContinue = () => {
    if (quizName && quizType) {
      setStep(2);
    } else {
      alert("Please enter a quiz name and select a quiz type.");
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          text: "",
          options: ["", ""],
          correctOption: 0,
          timer: "off",
          optionType: "Text",
        },
      ]);
      setActiveQuestionIndex(questions.length);
    } else {
      alert("Maximum of 5 questions allowed.");
    }
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].text = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionTypeChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].optionType = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    if (questions[index].options.length < 4) {
      const newQuestions = [...questions];
      newQuestions[index].options.push("");
      setQuestions(newQuestions);
    } else {
      alert("Maximum of 4 options per question allowed.");
    }
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    if (questions[qIndex].options.length > 2) {
      const newQuestions = [...questions];
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleTimerChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = e.target.value;
    setQuestions(newQuestions);
  };

  // Handle setting the correct option
  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = oIndex;
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    const quizData = {
      title: quizName,
      quizCategory: quizType,
      questions: questions.map((q) => ({
        text: q.text,
        type: quizType,
        options: q.options,
        timer: q.timer === "off" ? 0 : q.timer, // Convert "off" to 0
        correctOption: quizType === "Q&A" ? q.correctOption : undefined,
      })),
      quizStructure:
        questions.length > 1 ? "Multiple Questions" : "Single Question",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a quiz.");
        return;
      }

      const createResponse = await axios.post(
        "http://localhost:5000/api/quizzes/create",
        quizData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const quizId = createResponse.data._id;

      const shareResponse = await axios.get(
        `http://localhost:5000/api/quizzes/share/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShareLink(shareResponse.data.link); // Store the share link
    } catch (error) {
      console.error(
        "Error creating quiz:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Failed to create quiz. " +
          (error.response ? error.response.data.message : "")
      );
    }
  };

  const handleQuestionNavigation = (index) => {
    setActiveQuestionIndex(index);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {step === 1 ? (
          <>
            <h2>Create a New Quiz</h2>
            <div className="form-group">
              <label>Quiz Name:</label>
              <input
                type="text"
                value={quizName}
                onChange={handleQuizNameChange}
                placeholder="Enter quiz name"
              />
            </div>
            <div className="form-group">
              <label>Quiz Type:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Q&A"
                    checked={quizType === "Q&A"}
                    onChange={handleQuizTypeChange}
                  />
                  Q&A
                </label>
                <label>
                  <input
                    type="radio"
                    value="Poll"
                    checked={quizType === "Poll"}
                    onChange={handleQuizTypeChange}
                  />
                  Poll Type
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleContinue}>Continue</button>
            </div>
          </>
        ) : (
          <>
            {shareLink ? (
              <ShareQuizModal link={shareLink} onClose={onClose} />
            ) : (
              <>
                <div className="question-navigation">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`question-button ${
                        activeQuestionIndex === index ? "active" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  {questions.length < 5 && (
                    <button
                      onClick={handleAddQuestion}
                      className="add-question-button"
                    >
                      +
                    </button>
                  )}
                </div>
                <h2>
                  {quizType} Quiz - Question {activeQuestionIndex + 1}
                </h2>
                <div className="question-group">
                  <input
                    type="text"
                    value={questions[activeQuestionIndex].text}
                    onChange={(e) =>
                      handleQuestionChange(activeQuestionIndex, e)
                    }
                    placeholder="Enter question text"
                  />
                  <div className="form-group">
                    <label>Option Type:</label>
                    <select
                      value={questions[activeQuestionIndex].optionType}
                      onChange={(e) =>
                        handleOptionTypeChange(activeQuestionIndex, e)
                      }
                    >
                      <option value="Text">Text</option>
                      <option value="Image URL">Image URL</option>
                      <option value="Text & Image URL">Text & Image URL</option>
                    </select>
                  </div>
                  {questions[activeQuestionIndex].options.map(
                    (option, oIndex) => (
                      <div key={oIndex} className="option-group">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(activeQuestionIndex, oIndex, e)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                        />
                        {quizType === "Q&A" && (
                          <input
                            type="radio"
                            name={`correctOption-${activeQuestionIndex}`}
                            checked={
                              questions[activeQuestionIndex].correctOption ===
                              oIndex
                            }
                            onChange={() =>
                              handleCorrectOptionChange(
                                activeQuestionIndex,
                                oIndex
                              )
                            }
                          />
                        )}
                        {questions[activeQuestionIndex].options.length > 2 && (
                          <button
                            onClick={() =>
                              handleRemoveOption(activeQuestionIndex, oIndex)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )
                  )}
                  {questions[activeQuestionIndex].options.length < 4 && (
                    <button
                      onClick={() => handleAddOption(activeQuestionIndex)}
                    >
                      Add Option
                    </button>
                  )}
                  <div className="form-group">
                    <label>Timer:</label>
                    <select
                      value={questions[activeQuestionIndex].timer}
                      onChange={(e) =>
                        handleTimerChange(activeQuestionIndex, e)
                      }
                    >
                      <option value="off">Off</option>
                      <option value="5">5 seconds</option>
                      <option value="10">10 seconds</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleCancel}>Cancel</button>
                  <button onClick={handleCreateQuiz}>Create Quiz</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateQuizModal;
