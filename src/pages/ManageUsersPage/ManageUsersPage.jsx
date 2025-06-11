import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { FaTrash, FaSearch, FaEdit ,FaBars } from 'react-icons/fa';
import SideNav from '../../components/common/SideNavAdmin/SideNavAdmin';
import UserAvatar from '../../components/common/AdminNavbar/AdminNavbar';
import './ManageUsersPage.css';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
   const [currentUserEmail, setCurrentUserEmail] = useState('admin@example.com');
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    isActive: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching users with token:', token);

      const response = await axios.get('https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      console.log('Fetched users:', response.data);
      setUsers(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        console.log('Attempting to delete user:', userId);
        console.log('Using token:', token);

        const response = await axios.delete(
          `https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/users/${userId}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('Delete response:', response);

        if (response.status === 200 || response.status === 204) {
          setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
          setError(null);
        }
      } catch (err) {
        console.error('Delete error:', err);
        console.error('Error response:', err.response);
        setError(`Failed to delete user: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user);
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Attempting to update user:', selectedUser.id);
      console.log('Update payload:', editForm);
      console.log('Using token:', token);

      const updateData = {
        id: selectedUser.userId,
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        isActive: editForm.isActive
      };

      const response = await axios.put(
        `https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/users/${selectedUser.userId}`,
        updateData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Update response:', response);

      if (response.status === 200 || response.status === 204) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.userId === selectedUser.userId ? { ...user, ...updateData } : user
          )
        );
        setShowEditModal(false);
        setError(null);
      }
    } catch (err) {
      console.error('Update error:', err);
      console.error('Error response:', err.response);
      setError(`Failed to update user: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users p-4">
      <nav className="admin-navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={() => setIsSideNavOpen(!isSideNavOpen)}>
            <FaBars />
          </button>
          <h1 className="navbar-title">Admin</h1>
        </div>
        <div className="navbar-right">
          <UserAvatar email={currentUserEmail} />
        </div>
      </nav>

      <SideNav isOpen={isSideNavOpen} toggleSideNav={() => setIsSideNavOpen(false)} />
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5 pt-3">
        <h2>Manage Users</h2>
      </div>

      {/* Search and Filter Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch className="text-muted" />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
                <option value="technician">Technicians</option>
              </Form.Select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="">
          <Table hover responsive>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'success'}`}>
                      {user.role}
                    </span>
                  </td>
                  
                  <td>
                  {user.phone}
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEditUser(user)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.userId)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={editForm.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="Technician">Technician</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                label="Active"
                checked={editForm.isActive}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageUsersPage;