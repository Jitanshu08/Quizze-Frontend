import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateQuizModal from "../components/CreateQuizModal";
import EditQuizModal from "../components/EditQuizModal";
import DeleteQuizModal from "../components/DeleteQuizModal";
import Notification from "../components/Notification";
import "../css/analytics.css";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import shareIcon from "../assets/share.png";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const dateParts = new Date(date)
    .toLocaleDateString("en-GB", options)
    .split(" ");
  return `${dateParts[0]} ${dateParts[1]}, ${dateParts[2]}`;
};

const formatImpressions = (impressions) => {
  if (impressions >= 1000) {
    return (impressions / 1000).toFixed(1) + "K";
  }
  return impressions;
};

function AnalyticsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://localhost:5000/api/quizzes/my-quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
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

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedQuiz) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz._id === updatedQuiz._id ? updatedQuiz : quiz
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/quizzes/${selectedQuiz._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuizzes(quizzes.filter((quiz) => quiz._id !== selectedQuiz._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const handleShare = (quiz) => {
    const shareableLink = `${window.location.origin}/quiz/${quiz._id}`;
    navigator.clipboard.writeText(shareableLink);
    setNotification("Link copied to Clipboard!");
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="analytics-container">
      <Navbar onCreateQuiz={handleOpenModal} />
      <div className="analytics-content">
        <h2>Quiz Analysis</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Quiz Name</th>
                <th>Created on</th>
                <th>Impressions</th>
                <th>Actions</th>
                <th>Analysis</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz._id}>
                  <td>{index + 1}</td>
                  <td>{quiz.title}</td>
                  <td>{formatDate(quiz.createdAt)}</td>
                  <td>{formatImpressions(quiz.impressions)}</td>
                  <td>
                    <button onClick={() => handleEdit(quiz)}>
                      <img src={editIcon} alt="Edit" />
                    </button>
                    <button onClick={() => handleDelete(quiz)}>
                      <img src={deleteIcon} alt="Delete" />
                    </button>
                    <button onClick={() => handleShare(quiz)}>
                      <img src={shareIcon} alt="Share" />
                    </button>
                  </td>
                  <td>
                    <Link to={`/quiz-analysis/${quiz._id}`}>
                      Question Wise Analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="add-more-text">{"{more quiz can be added}"}</p>
      </div>
      {isModalOpen && (
        <CreateQuizModal
          onClose={handleCloseModal}
          onContinue={handleContinue}
        />
      )}
      {isEditModalOpen && (
        <EditQuizModal
          quiz={selectedQuiz}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteQuizModal
          quizTitle={selectedQuiz?.title}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
      {notification && (
        <Notification message={notification} onClose={closeNotification} />
      )}
    </div>
  );
}

export default AnalyticsPage;
