import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ReturnButton({ label = "Return", fallback = "/home" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === "/login") {
      navigate(fallback, { replace: true });
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return (
    <div className="return-bar">
      <button
        type="button"
        className="btn btn--secondary"
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}

export default ReturnButton;