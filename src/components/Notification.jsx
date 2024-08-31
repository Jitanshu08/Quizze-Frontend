import React, { useEffect } from "react";
import "../css/Notification.css";
import checkIcon from "../assets/check.png";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <div className="notification-icon">
        <img src={checkIcon} alt="Success" />
      </div>
      <div className="notification-message">{message}</div>
      <button className="notification-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Notification;
