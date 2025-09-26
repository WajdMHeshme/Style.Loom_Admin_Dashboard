import React from "react";
import "./LoadingWave.css"; // استدعاء ملف الـ CSS

const LoadingWave: React.FC = () => {
  return (
    <div className="loading-wave">
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
    </div>
  );
};

export default LoadingWave;
