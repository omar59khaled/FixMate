import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // Import styles
import notFound from '../../assets/images/404-error-template-.png'
const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={notFound } alt="notFound" />
      
    </div>
  );
};

export default NotFound;
