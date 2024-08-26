import React from "react";
import "../css/ShareQuizModal.css";

const ShareQuizModal = ({ link, onClose }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Adding the close button */}
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Congrats your Quiz is Published!</h2>
        <input type="text" value={link} readOnly />
        <div className="modal-actions">
          <button className="share-button" onClick={handleCopyLink}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default ShareQuizModal;