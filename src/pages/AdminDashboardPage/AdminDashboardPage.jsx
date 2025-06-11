import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaToolbox, FaClipboardList, FaBars } from 'react-icons/fa';
import { Table } from 'react-bootstrap';
import SideNav from '../../components/common/SideNavAdmin/SideNavAdmin';
import UserAvatar from '../../components/common/AdminNavbar/AdminNavbar';
import './AdminDashboardPage.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalTechnicians: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('admin@example.com');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [usersRes, servicesRes] = await Promise.all([
          axios.get('https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/services', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalServices: servicesRes.data.length,
          totalTechnicians: 0
        });

        setRecentUsers(usersRes.data.slice(-5).reverse());
        setRecentServices(servicesRes.data.slice(-5).reverse());
        
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger m-4" role="alert">{error}</div>;

  return (
    <div className="admin-layout">
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

      <div className="admin-content">
        <div className="admin-dashboard p-4">
          <div className="row g-4 mb-4 d-flex justify-content-between ">
            <div className="col-12 col-md-4 w-50">
              <div 
                className="card h-100 border-0 shadow-sm clickable"
                onClick={() => handleCardClick('/admin/manage/users')}
              >
                <div className="card-body d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3">
                    <FaUsers className="text-success fs-2" />
                  </div>
                  <div className="ms-3">
                    <h3 className="card-title h5">Total Users</h3>
                    <p className="card-text h2 mb-0">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 w-50">
              <div 
                className="card h-100 border-0 shadow-sm clickable"
                onClick={() => handleCardClick('/admin/manage/services')}
              >
                <div className="card-body d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3">
                    <FaToolbox className="text-success fs-2" />
                  </div>
                  <div className="ms-3">
                    <h3 className="card-title h5">Total Services</h3>
                    <p className="card-text h2 mb-0">{stats.totalServices}</p>
                  </div>
                </div>
              </div>
            </div>

            
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h4 className="card-title h5 mb-0">Recent Users</h4>
                </div>
                <div className="card-body">
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name || 'N/A'}</td>
                          <td>{user.email}</td>
                      
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h4 className="card-title h5 mb-0">Recent Services</h4>
                </div>
                <div className="card-body">
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Service Name</th>
                        <th>Category</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {recentServices.map(service => (
                        <tr key={service.id}>
                          <td>{service.seR_Name}</td>
                          <td>{service.category}</td>
                          
                         
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;