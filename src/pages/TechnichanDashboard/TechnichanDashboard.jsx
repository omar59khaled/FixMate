import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './TechnichanDashboard.css';

const TechnicianDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technicianInfo, setTechnicianInfo] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  // Modal state variables
  const [showModal, setShowModal] = useState(false);
  const [currentNotificationId, setCurrentNotificationId] = useState(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [submittingPrice, setSubmittingPrice] = useState(false);
  
  const navigate = useNavigate();
  const { techId } = useParams(); // Get technician ID from URL parameter

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    // Check if techId is valid
    if (!techId || techId === 'undefined') {
      // If techId is invalid but we have a stored user who is a technician
      if (storedUser && storedUser.role === 'Technician' && storedUser.id) {
        navigate(`/technician-dashboard/${storedUser.id}`);
        return;
      } else if (!storedUser || storedUser.role !== 'Technician') {
        navigate('/login');
        return;
      }
    }
    
    // If we have a valid techId, use it for the URL and store in state
    const validTechId = (techId && techId !== 'undefined') ? techId : (storedUser?.id || null);
    
    if (validTechId) {
      setTechnicianInfo(storedUser || { id: validTechId, role: 'Technician' });
      fetchNotifications();
    } else {
      setError("Could not determine technician ID. Please log in again.");
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate, techId]);

  // Fetch notifications for the technician using token authentication
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Get token from localStorage
      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication token not found. Please log in again.");
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      console.log("Fetching notifications with token authentication");
      const response = await axios.get(
        'https://hf1bv21q-5049.uks1.devtunnels.ms/api/Technician/notifications',
        config
      );
      
      console.log("API Response:", response.data);
      
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
        // Count unread notifications
        const unreadNotifications = response.data.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
      } else {
        console.error("Unexpected API response format:", response.data);
        setError('Received unexpected data format from server');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(`Failed to load notifications: ${err.message}`);
      }
      
      setLoading(false);
    }
  };

  // Handle notification response (mark as read and update booking status)
  const handleNotificationResponse = async (notificationId, bookingStatus) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      if (!token) {
        console.error("No authentication token found");
        alert("Authentication failed. Please log in again.");
        navigate('/login');
        return;
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.put(
        'https://hf1bv21q-5049.uks1.devtunnels.ms/api/Technician/notifications/respond',
        {
          notificationId: notificationId,
          isRead: true,
          bookingStatus: bookingStatus
        },
        config
      );

      // Update the local state after successful response
      setNotifications(prevNotifications => {
        const updated = prevNotifications.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, isRead: true, bookingStatus: bookingStatus } 
            : notification
        );
        
        // Recalculate unread count
        const unreadNotifications = updated.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
        
        return updated;
      });

      alert(`Successfully updated notification status to: ${bookingStatus}`);
    } catch (err) {
      console.error('Error responding to notification:', err);
      
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        alert(`Failed to update notification: ${err.message}`);
      }
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.put(
        'https://hf1bv21q-5049.uks1.devtunnels.ms/api/Technician/notifications/read',
        {
          notificationId: notificationId,
          isRead: true
        },
        config
      );

      // Update the local state to mark as read
      setNotifications(prevNotifications => {
        const updated = prevNotifications.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        );
        
        // Recalculate unread count
        const unreadNotifications = updated.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
        
        return updated;
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    }
  };

  // Submit price offer - UPDATED to only send notificationId and offeredPrice
  const submitPriceOffer = async (e) => {
    e.preventDefault();
    
    if (!offeredPrice || isNaN(parseFloat(offeredPrice)) || parseFloat(offeredPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    try {
      setSubmittingPrice(true);
      const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
      
      if (!token) {
        console.error("No authentication token found");
        alert("Authentication failed. Please log in again.");
        navigate('/login');
        return;
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Log request details for debugging - REMOVED technicianId
      console.log('Submitting price offer with data:', {
        notificationId: currentNotificationId,
        offeredPrice: parseFloat(offeredPrice)
      });
      
      // Try with both possible endpoints
      let response;
      
      try {
        // Try original endpoint first
        response = await axios.post(
          'https://hf1bv21q-5049.uks1.devtunnels.ms/api/Technician/submit-offer',
          {
            notificationId: currentNotificationId,
            offeredPrice: parseFloat(offeredPrice)
          },
          config
        );
      } catch (firstError) {
        console.log('First endpoint failed, trying alternative endpoint');
        
        // If first endpoint fails, try alternative endpoint
        response = await axios.post(
          'https://hf1bv21q-5049.uks1.devtunnels.ms/api/Booking/technician-offer',
          {
            notificationId: currentNotificationId,
            offeredPrice: parseFloat(offeredPrice)
          },
          config
        );
      }
      
      console.log('Price offer submitted successfully:', response.data);
      alert('Price offer submitted successfully!');
      
      // Close modal and reset form
      setShowModal(false);
      setOfferedPrice('');
      setCurrentNotificationId(null);
      
      // Refresh notifications to see updated status
      fetchNotifications();
    } catch (err) {
      console.error('Error submitting price offer:', err);
      
      // Enhanced error handling with more detailed messages
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response status:', err.response.status);
        
        if (err.response.status === 401) {
          alert('Your session has expired. Please log in again.');
          navigate('/login');
        } else if (err.response.status === 404) {
          alert('The price submission endpoint was not found. Please contact your administrator.');
        } else {
          alert(`Failed to submit price offer: ${err.response?.data?.message || err.response?.data || err.message}`);
        }
      } else if (err.request) {
        alert('Network error: Server did not respond. Please check your connection.');
        console.error('No response received:', err.request);
      } else {
        alert(`Error preparing request: ${err.message}`);
      }
    } finally {
      setSubmittingPrice(false);
    }
  };

  // Open price modal for a notification
  const openPriceModal = (notificationId) => {
    setCurrentNotificationId(notificationId);
    setOfferedPrice('');
    setShowModal(true);
  };

  // Close price modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentNotificationId(null);
    setOfferedPrice('');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  // Manually refresh notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return (
    <div className="error-container">
      <div className="error">{error}</div>
      <button onClick={() => navigate('/login')} className="retry-btn">Log In Again</button>
    </div>
  );
  if (!technicianInfo) return <div className="error">User information not found</div>;

  return (
    <div className="technician-dashboard" dir="auto">
      <header className="dashboard-header">
        <h1>Technician Dashboard</h1>
        <div className="user-info">
          <div className="notification-icon">
            <span className="icon">🔔</span>
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>
          <span>Welcome, {technicianInfo.name || technicianInfo.username || `Technician #${technicianInfo.id}`}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="technician-info-section">
          <h2>My Information</h2>
          <div className="info-card">
            <p><strong>ID:</strong> {technicianInfo.id}</p>
            <p><strong>Email:</strong> {technicianInfo.email || 'N/A'}</p>
            <p><strong>Role:</strong> {technicianInfo.role}</p>
          </div>
        </div>

        <div className="notifications-section">
          <div className="notifications-header">
            <h2>Notifications</h2>
            <button onClick={refreshNotifications} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications at this time.</p>
              <p className="empty-icon">📭</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.notificationId} 
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => !notification.isRead && markAsRead(notification.notificationId)}
                >
                  <div className="notification-status">
                    {notification.isRead ? <span className="read-icon">✓</span> : <span className="unread-icon">●</span>}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3 className="user-name">{notification.user_Name}</h3>
                      <span className="notification-time">
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Recently'}
                      </span>
                    </div>
                    
                    <p className="message-content">{notification.content}</p>
                    
                    <div className="booking-status">
                      <span className={`status-badge ${notification.bookingStatus?.toLowerCase() || 'pending'}`}>
                        {notification.bookingStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationResponse(notification.notificationId, 'Approved');
                          }}
                          className="action-btn approve"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationResponse(notification.notificationId, 'Rejected');
                          }}
                          className="action-btn reject"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openPriceModal(notification.notificationId);
                      }}
                      className="action-btn price"
                    >
                      Add Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="price-modal">
            <div className="modal-header">
              <h3>Submit Price Offer</h3>
              <button className="close-modal" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={submitPriceOffer}>
              <div className="form-group">
                <label htmlFor="price">Your Price Offer:</label>
                <div className="price-input-container">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    id="price"
                    min="0.01"
                    step="0.01"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    placeholder="Enter your price"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submittingPrice}
                >
                  {submittingPrice ? 'Submitting...' : 'Submit Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;