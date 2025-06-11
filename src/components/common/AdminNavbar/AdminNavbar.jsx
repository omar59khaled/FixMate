// components/common/AdminNavbar/AdminNavbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = ({ email }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const initial = email ? email[0].toUpperCase() : 'A';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleDragEnd = (e) => {
    const dragDistance = e.clientX - e.target.getBoundingClientRect().left;
    if (dragDistance > 100) { // If dragged more than 100px
      handleLogout();
    }
  };

  return (
    <div className="admin-avatar-container">
      <div 
        className="admin-avatar" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        draggable="true"
        onDragEnd={handleDragEnd}
      >
        {initial}
      </div>
      {isMenuOpen && (
        <div className="admin-menu">
          <div className="admin-menu-item" onClick={() => navigate('/admin/profile')}>
            Profile Settings
          </div>
          <div className="admin-menu-item" onClick={handleLogout}>
            Logout
          </div>
         
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;