import React from "react";
import "../css/DeleteQuizModal.css";

const DeleteQuizModal = ({ quizTitle, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delete Quiz</h2>
        <p>Are you sure you want to delete the quiz "{quizTitle}"?</p>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuizModal;