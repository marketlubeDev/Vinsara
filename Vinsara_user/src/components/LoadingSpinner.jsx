import React from "react";

function LoadingSpinner({ height }) {
  return (
    <div
      className="loading-spinner-container"
      style={{ height: height || "calc(100vh - 8rem)" }}
    >
      <div className="saw-spinner">
        <div className="saw-blade"></div>
        <div className="saw-text">Northlux</div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
