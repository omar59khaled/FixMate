// components/common/SideNavAdmin/SideNavAdmin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaToolbox, FaClipboardList, FaTimes , FaHome } from 'react-icons/fa';
import './SideNavAdmin.css';

const SideNavAdmin = ({ isOpen, toggleSideNav }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: FaHome, label: 'Home', path: '/admin/' },
    { icon: FaUsers, label: 'Manage Users', path: '/admin/manage/users' },
    { icon: FaToolbox, label: 'Manage Services', path: '/admin/manage/services' },
   
  ];

  const handleNavigation = (path) => {
    navigate(path);
    toggleSideNav();
  };

  return (
    <>
      <div className={`side-nav ${isOpen ? 'open' : ''}`}>
        <div className="side-nav-header">
          <button className="close-btn" onClick={toggleSideNav}>
            <FaTimes />
          </button>
        </div>
        <ul className="side-nav-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button 
                onClick={() => handleNavigation(item.path)} 
                className="side-nav-link"
              >
                <item.icon className="side-nav-icon" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isOpen && <div className="side-nav-overlay" onClick={toggleSideNav} />}
    </>
  );
};

export default SideNavAdmin;