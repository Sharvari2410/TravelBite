import React from "react";
export default function Button({ children, type = "button", className = "", onClick, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${className}`.trim()}
    >
      {children}
    </button>
  );
}