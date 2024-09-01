import React, { useState } from "react";
import "../css/ShareQuizModal.css";
import Notification from "./Notification";

const ShareQuizModal = ({ link, onClose }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Congrats your Quiz is Published!</h2>
        <input type="text" value={link} readOnly className="modal-input" />
        <div className="modal-actions">
          <button className="share-button" onClick={handleCopyLink}>
            Share
          </button>
        </div>
        {showNotification && (
          <Notification
            message="Link copied to clipboard"
            onClose={handleCloseNotification}
            className="notification-inside-modal"
          />
        )}
      </div>
    </div>
  );
};

export default ShareQuizModal;
