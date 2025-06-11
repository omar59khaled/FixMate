import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Edit3, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImage, setProfileImage] = useState(null);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    image: ''
  });

  // Edit form state
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    image: null
  });

  // Get user from localStorage and fetch profile when component mounts or user changes
  useEffect(() => {
    const initializeProfile = () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          
          // Fetch profile for this specific user
          fetchProfile(user);
        } else {
          setLoading(false);
          setMessage({ 
            type: 'error', 
            text: 'No user found in localStorage. Please login first.' 
          });
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        setLoading(false);
        setMessage({ 
          type: 'error', 
          text: 'Error loading user data. Please login again.' 
        });
      }
    };

    initializeProfile();
  }, []); // Empty dependency array - runs once on mount

  // Fetch profile with authentication
  const fetchProfile = async (user = currentUser, showLoader = true) => {
    if (!user) {
      setMessage({ type: 'error', text: 'No user data available' });
      setLoading(false);
      return;
    }

    if (showLoader) setLoading(true);
    
    try {
      // Get token from localStorage (adjust key name as needed)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://hf1bv21q-5049.uks1.devtunnels.ms/api/User/profile', {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Map API response to profile state
      const mappedData = {
        name: data.name || '',
        email: data.email || user.email || '', // Fallback to user email from localStorage
        phone: data.phone || '',
        address: data.address || '',
        image: data.image || ''
      };
      
      setProfileData(mappedData);
      setEditData(mappedData);
      setMessage({ type: '', text: '' }); // Clear any previous error messages
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to load profile: ${error.message}` 
      });
      
      // Use fallback data based on localStorage user
      const fallbackData = {
        name: user.name || 'User',
        email: user.email || '',
        phone: '',
        address: '',
        image: ''
      };
      setProfileData(fallbackData);
      setEditData(fallbackData);
      
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // Refresh profile data (useful when user data changes)
  const refreshProfile = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchProfile(user, false); // Don't show loader for refresh
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData, image: null });
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData, image: null });
    setProfileImage(null);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'No user data available' });
      return;
    }

    setSaving(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Add all fields - send empty string if no value
      formData.append('Email', editData.email || '');
      formData.append('Name', editData.name || '');
      formData.append('Phone', editData.phone || '');
      formData.append('Address', editData.address || '');
      
      // Add image file if selected
      if (editData.image) {
        formData.append('Image', editData.image);
      } else {
        formData.append('Image', '');
      }

      const headers = {};
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://hf1bv21q-5049.uks1.devtunnels.ms/api/User/UpdateProfile', {
        method: 'PUT',
        headers: headers,
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Try to get updated data from API response
      let serverData = null;
      try {
        const responseText = await response.text();
        if (responseText && responseText.trim()) {
          serverData = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.log('No JSON response or parse error:', parseError);
      }

      // Update profile data
      const updatedData = {
        name: serverData?.name || editData.name || '',
        email: serverData?.email || editData.email || '',
        phone: serverData?.phone || editData.phone || '',
        address: serverData?.address || editData.address || '',
        image: serverData?.image || profileImage || profileData.image || ''
      };

      // Update states
      setProfileData(updatedData);
      setEditData(updatedData);
      setIsEditing(false);
      setProfileImage(null);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update localStorage user data if email changed
      if (updatedData.email !== currentUser.email) {
        const updatedUser = { ...currentUser, email: updatedData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to update profile: ${error.message}` 
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserTypeColor = () => {
    const role = currentUser?.role?.toLowerCase();
    switch (role) {
      case 'admin': return 'bg-success';
      case 'technician': return 'bg-primary';
      case 'user': return 'bg-info';
      default: return 'bg-info';
    }
  };

  const getUserTypeLabel = () => {
    return currentUser?.role || 'User';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-success" style={{ width: '4rem', height: '4rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <AlertCircle size={64} className="text-danger mb-3" />
          <h3 className="text-danger">No User Data</h3>
          <p className="text-muted">Please login to view your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              
              {/* Header */}
              <div className={`card-header ${getUserTypeColor()} text-white position-relative overflow-hidden`} style={{ borderRadius: '0.5rem 0.5rem 0 0' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: '0.1' }}></div>
                <div className="position-relative" style={{ zIndex: 10 }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="h2 mb-0 fw-bold">Profile</h1>
                    <div className="d-flex gap-2 align-items-center">
                      <span className="badge bg-light bg-opacity-25 fs-6 fw-normal px-3 py-2">
                        {getUserTypeLabel()}
                      </span>
                      <button 
                        onClick={refreshProfile}
                        className="btn btn-light btn-sm"
                        title="Refresh Profile"
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="card shadow-lg" style={{ borderRadius: '0 0 0.5rem 0.5rem', border: 'none' }}>
                {/* Message Display */}
                {message.text && (
                  <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} border-start border-5 m-3`}>
                    <div className="d-flex align-items-center">
                      {message.type === 'success' ? 
                        <CheckCircle className="me-2" size={20} /> : 
                        <AlertCircle className="me-2" size={20} />
                      }
                      {message.text}
                    </div>
                  </div>
                )}

                <div className="card-body p-5">
                  {/* Profile Image Section */}
                  <div className="text-center mb-5">
                    <div className="position-relative d-inline-block">
                      <img
                        src={profileImage || profileData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt="Profile"
                        className="rounded-circle border border-success border-4 shadow-lg"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                      {isEditing && (
                        <label className="position-absolute bottom-0 end-0 btn btn-success rounded-circle p-2 shadow" style={{ cursor: 'pointer' }}>
                          <Camera size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="d-none"
                          />
                        </label>
                      )}
                    </div>
                    <h2 className="fw-bold text-dark mt-3">
                      {profileData.name || 'No Name'}
                    </h2>
                  </div>

                  {/* Profile Information */}
                  <div className="row g-4">
                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center fw-semibold text-secondary">
                        <Mail className="me-2 text-success" size={16} />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="form-control form-control-lg border-2 border-light"
                          style={{ transition: 'all 0.3s' }}
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          placeholder="Enter your email"
                          onFocus={(e) => e.target.style.borderColor = '#198754'}
                          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                        />
                      ) : (
                        <div className="form-control form-control-lg bg-light border-2" style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
                          {profileData.email || 'Not provided'}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center fw-semibold text-secondary">
                        <User className="me-2 text-success" size={16} />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 border-light"
                          style={{ transition: 'all 0.3s' }}
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="Enter your full name"
                          onFocus={(e) => e.target.style.borderColor = '#198754'}
                          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                        />
                      ) : (
                        <div className="form-control form-control-lg bg-light border-2" style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
                          {profileData.name || 'Not provided'}
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center fw-semibold text-secondary">
                        <Phone className="me-2 text-success" size={16} />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="form-control form-control-lg border-2 border-light"
                          style={{ transition: 'all 0.3s' }}
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          onFocus={(e) => e.target.style.borderColor = '#198754'}
                          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                        />
                      ) : (
                        <div className="form-control form-control-lg bg-light border-2" style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
                          {profileData.phone || 'Not provided'}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center fw-semibold text-secondary">
                        <MapPin className="me-2 text-success" size={16} />
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 border-light"
                          style={{ transition: 'all 0.3s' }}
                          value={editData.address}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          placeholder="Enter your address"
                          onFocus={(e) => e.target.style.borderColor = '#198754'}
                          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                        />
                      ) : (
                        <div className="form-control form-control-lg bg-light border-2" style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
                          {profileData.address || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-5 pt-4 border-top">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="btn btn-secondary btn-lg px-4 d-flex align-items-center gap-2"
                          style={{ transition: 'all 0.3s' }}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="btn btn-success btn-lg px-4 d-flex align-items-center gap-2"
                          style={{ transition: 'all 0.3s' }}
                        >
                          {saving ? (
                            <>
                              <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="btn btn-success btn-lg px-4 d-flex align-items-center gap-2"
                        style={{ transition: 'all 0.3s' }}
                      >
                        <Edit3 size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Current User Info - Debug section */}
              {currentUser && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-body">
                    <p className="text-muted mb-2 small">Current User Info (from localStorage):</p>
                    <div className="bg-light p-3 rounded small">
                      <strong>ID:</strong> {currentUser.id} | 
                      <strong>Email:</strong> {currentUser.email} | 
                      <strong>Role:</strong> {currentUser.role}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;