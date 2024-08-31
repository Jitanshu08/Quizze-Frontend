import React from "react";
import "../css/DeleteQuizModal.css";

const DeleteQuizModal = ({ quizTitle, onClose, onConfirm }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <p>Are you confirm you want to delete "{quizTitle}"?</p>
        <div className="delete-modal-actions">
          <button className="delete-confirm-button" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button className="delete-cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuizModal;
