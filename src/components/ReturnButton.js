import React from "react";
import { useNavigate } from "react-router-dom";

function ReturnButton({ label = "Return", fallback = "/home" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <div className="return-bar">
      <button type="button" className="btn btn--secondary" onClick={handleClick}>
        {label}
      </button>
    </div>
  );
}

export default ReturnButton;
