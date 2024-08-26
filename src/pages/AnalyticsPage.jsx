import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/analytics.css";
import CreateQuizModal from "../components/CreateQuizModal"; // Import CreateQuizModal

function AnalyticsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
    <div className="analytics-container">
      <Navbar onCreateQuiz={handleOpenModal} /> {/* Pass the function as a prop */}
      <div className="analytics-content">
        <h2>Quiz Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th>Actions</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                <td>{quiz.impressions}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                  <button>Share</button>
                </td>
                <td>
                  <a href="#">Question Wise Analysis</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="add-more-text">{"{more quiz can be added}"}</p>
      </div>
      {isModalOpen && (
        <CreateQuizModal onClose={handleCloseModal} onContinue={handleContinue} />
      )}
    </div>
  );
}

export default AnalyticsPage;
