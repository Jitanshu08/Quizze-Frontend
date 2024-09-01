import React, { useState } from "react";
import "../css/CreateQuizModal.css";
import ShareQuizModal from "./ShareQuizModal";
import axios from "axios";

const CreateQuizModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ], // Ensure at least two options initially
      correctOption: 0,
      timer: "off",
      optionType: "Text",
    },
  ]);
  const [shareLink, setShareLink] = useState(null);

  const handleQuizNameChange = (e) => setQuizName(e.target.value);
  const handleQuizTypeChange = (type) => setQuizType(type);

  const handleCancel = () => {
    onClose();
  };

  const handleContinue = () => {
    if (!quizName) {
      alert("Please enter a quiz name.");
    } else if (!quizType) {
      alert("Please select a quiz type.");
    } else {
      setStep(2);
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          text: "",
          options: [
            { text: "", imageUrl: "" },
            { text: "", imageUrl: "" },
          ], // Ensure new questions also have two options initially
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

  const handleOptionTypeChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].optionType = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e, field) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    if (questions[index].options.length < 4) {
      const newQuestions = [...questions];
      newQuestions[index].options.push({ text: "", imageUrl: "" });
      setQuestions(newQuestions);
    } else {
      alert("Maximum of 4 options per question allowed.");
    }
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    if (questions[qIndex].options.length > 2) {
      // Ensure at least two options remain
      const newQuestions = [...questions];
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    } else {
      alert("At least two options are required.");
    }
  };

  const handleTimerChange = (index, time) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = time;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = oIndex;
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    const quizData = {
      title: quizName,
      quizCategory: quizType,
      questions: questions.map((q) => {
        let formattedOptions;
        if (q.optionType === "Text") {
          formattedOptions = q.options.map((opt) => ({
            text: opt.text,
          }));
        } else if (q.optionType === "Image URL") {
          formattedOptions = q.options.map((opt) => ({
            imageUrl: opt.imageUrl,
          }));
        } else if (q.optionType === "Text & Image URL") {
          formattedOptions = q.options.map((opt) => ({
            text: opt.text,
            imageUrl: opt.imageUrl,
          }));
        }

        return {
          text: q.text,
          type: quizType,
          options: formattedOptions,
          optionType: q.optionType,
          timer: q.timer === "off" ? 0 : q.timer,
          correctOption: quizType === "Q&A" ? q.correctOption : undefined,
        };
      }),
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

      setShareLink(shareResponse.data.link);
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

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
  };

  return (
    <div className="create-quiz-modal-overlay">
      <div className="create-quiz-modal-content">
        {step === 1 ? (
          <>
            <input
              type="text"
              value={quizName}
              onChange={handleQuizNameChange}
              placeholder="Quiz name"
              className="create-quiz-name-input"
            />
            <div className="quiz-type-selection">
              <span className="create-quiz-type-label">Quiz Type</span>
              <button
                className={`quiz-type-button ${
                  quizType === "Q&A" ? "active" : ""
                }`}
                onClick={() => handleQuizTypeChange("Q&A")}
              >
                Q & A
              </button>
              <button
                className={`quiz-type-button ${
                  quizType === "Poll" ? "active" : ""
                }`}
                onClick={() => handleQuizTypeChange("Poll")}
              >
                Poll Type
              </button>
            </div>
            <div className="create-quiz-modal-actions">
              <button
                onClick={handleCancel}
                className="create-quiz-cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="create-quiz-continue-button"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {shareLink ? (
              <ShareQuizModal link={shareLink} onClose={onClose} />
            ) : (
              <>
                <div className="create-quiz-question-navigation">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className="create-quiz-question-button-container"
                    >
                      <button
                        onClick={() => handleQuestionNavigation(index)}
                        className={`create-quiz-question-button ${
                          activeQuestionIndex === index ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                      {questions.length > 1 && (
                        <div
                          className="create-quiz-remove-question-button"
                          onClick={() => handleRemoveQuestion(index)}
                        />
                      )}
                    </div>
                  ))}
                  {questions.length < 5 && (
                    <button
                      onClick={handleAddQuestion}
                      className="create-quiz-add-question-button"
                    >
                      +
                    </button>
                  )}
                </div>
                <div className="create-quiz-question-group">
                  <input
                    type="text"
                    value={questions[activeQuestionIndex].text}
                    onChange={(e) =>
                      handleQuestionChange(activeQuestionIndex, e)
                    }
                    placeholder="Enter question text"
                    className="create-quiz-name-input"
                    style={{ width: "673px" }}
                  />
                  <div className="option-type-form-group">
                    <label>Option Type:</label>
                    <label>
                      <input
                        type="radio"
                        name={`optionType-${activeQuestionIndex}`}
                        value="Text"
                        checked={
                          questions[activeQuestionIndex].optionType === "Text"
                        }
                        onChange={() =>
                          handleOptionTypeChange(activeQuestionIndex, "Text")
                        }
                      />
                      Text
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`optionType-${activeQuestionIndex}`}
                        value="Image URL"
                        checked={
                          questions[activeQuestionIndex].optionType ===
                          "Image URL"
                        }
                        onChange={() =>
                          handleOptionTypeChange(
                            activeQuestionIndex,
                            "Image URL"
                          )
                        }
                      />
                      Image URL
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`optionType-${activeQuestionIndex}`}
                        value="Text & Image URL"
                        checked={
                          questions[activeQuestionIndex].optionType ===
                          "Text & Image URL"
                        }
                        onChange={() =>
                          handleOptionTypeChange(
                            activeQuestionIndex,
                            "Text & Image URL"
                          )
                        }
                      />
                      Text & Image URL
                    </label>
                  </div>
                  {questions[activeQuestionIndex].options.map(
                    (option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`create-quiz-option-group ${
                          quizType === "Q&A" &&
                          questions[activeQuestionIndex].correctOption ===
                            oIndex
                            ? "correct"
                            : ""
                        }`}
                      >
                        {/* Conditionally render the radio button for Q&A type quizzes only */}
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
                        {questions[activeQuestionIndex].optionType ===
                        "Text" ? (
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(
                                activeQuestionIndex,
                                oIndex,
                                e,
                                "text"
                              )
                            }
                            placeholder={`Text ${oIndex + 1}`}
                          />
                        ) : questions[activeQuestionIndex].optionType ===
                          "Image URL" ? (
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
                          />
                        ) : (
                          <div className="text-image-inputs">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(
                                  activeQuestionIndex,
                                  oIndex,
                                  e,
                                  "text"
                                )
                              }
                              placeholder={`Text ${oIndex + 1}`}
                              className="text-input"
                            />
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
                          </div>
                        )}
                        {questions[activeQuestionIndex].options.length > 2 && (
                          <button
                            className="create-quiz-remove-option-button"
                            onClick={() =>
                              handleRemoveOption(activeQuestionIndex, oIndex)
                            }
                          />
                        )}
                      </div>
                    )
                  )}
                  {questions[activeQuestionIndex].options.length < 4 && (
                    <button
                      onClick={() => handleAddOption(activeQuestionIndex)}
                      className="create-quiz-add-option-button"
                    >
                      Add Option
                    </button>
                  )}
                  <div className="create-quiz-timer-group">
                    <label>Timer</label>
                    <button
                      className={`${
                        questions[activeQuestionIndex].timer === "off"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleTimerChange(activeQuestionIndex, "off")
                      }
                    >
                      OFF
                    </button>
                    <button
                      className={`${
                        questions[activeQuestionIndex].timer === "5"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleTimerChange(activeQuestionIndex, "5")
                      }
                    >
                      5 sec
                    </button>
                    <button
                      className={`${
                        questions[activeQuestionIndex].timer === "10"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleTimerChange(activeQuestionIndex, "10")
                      }
                    >
                      10 sec
                    </button>
                  </div>
                </div>
                <div className="create-quiz-modal-actions">
                  <button
                    onClick={handleCancel}
                    className="create-quiz-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateQuiz}
                    className="create-quiz-continue-button create-quiz-create-button"
                  >
                    Create Quiz
                  </button>
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
