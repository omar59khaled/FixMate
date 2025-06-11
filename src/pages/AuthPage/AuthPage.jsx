import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container card shadow-lg border-0 rounded-4  form-card py-5 px-5">
        <h2 className="auth-title text-center mb-4 fw-bold text-success">Get Started</h2>
        <p className="auth-subtitle ">Join us and book trusted home services easily </p>
        <div className="auth-buttons">
          <button onClick={() => navigate("/signup")} className="signup-btn btn btn-success w-100 mb-3 py-3 custom-button ">Sign Up</button>
          <button onClick={() => navigate("/login")} className="login-btn btn btn-success w-100 mb-3 py-3 custom-button">Log In</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
