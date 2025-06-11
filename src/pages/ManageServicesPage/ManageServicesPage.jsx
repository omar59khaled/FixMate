import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBars } from 'react-icons/fa';
import SideNav from '../../components/common/SideNavAdmin/SideNavAdmin';
import UserAvatar from '../../components/common/AdminNavbar/AdminNavbar';
import './ManageServicesPage.css';


const ManageServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('admin@example.com');
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const [formData, setFormData] = useState({
    ser_id: null,
    seR_Name: '',
    category: '',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services whenever the search term or services list changes
    handleSearch(searchTerm);
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data);
      setFilteredServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredServices(services);
      return;
    }
    
    const lowerCaseTerm = term.toLowerCase();
    const filtered = services.filter(service => 
      service.seR_Name.toLowerCase().includes(lowerCaseTerm) ||
      service.category.toLowerCase().includes(lowerCaseTerm) ||
      service.description.toLowerCase().includes(lowerCaseTerm)
    );
    
    setFilteredServices(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle the special case for the name field
    const fieldName = name === 'name' ? 'seR_Name' : name;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      // Create a FormData object to handle both text fields and file upload
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('seR_Name', formData.seR_Name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      
      // Append image file if there is one
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }
      
      // If we're editing, add the ID
      if (selectedService) {
        formDataToSend.append('ser_id', selectedService.ser_id);
      }

      let response;
      
      if (selectedService) {
        // Update service
        response = await axios.put(
          `https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/services/${selectedService.ser_id}`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new service
        response = await axios.post(
          'https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/services',
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      await fetchServices();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(
          `https://hf1bv21q-5049.uks1.devtunnels.ms/api/Dashboard/services/${serviceId}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          }
        );
        await fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
        setError('Failed to delete service');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setSelectedImage(null);
    setFormData({
      ser_id: null,
      seR_Name: '',
      category: '',
      description: '',
      image: null
    });
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        ser_id: service.ser_id,
        seR_Name: service.seR_Name, // Match exact case from API
        category: service.category, // Match exact case from API
        description: service.description,
        image: null
      });
      // Use the imageUrl from the API response
      setSelectedImage(service.imageUrl);
    } else {
      handleCloseModal();
    }
    setShowModal(true);
  };
  
  return (
    
    <div className="manage-services p-4">
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

      <div className="d-flex justify-content-between align-items-center mb-4 mt-5 pt-3 ">
        <h2>Manage Services</h2>
        <Button 
          variant="success " 
          onClick={() => handleOpenModal()}
          className="d-flex align-items-center gap-2"
        >

          
          <FaPlus className='btn btn-success'/> Add New Service
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by name, category, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-4">
              <p className="mb-0">{searchTerm ? 'No services match your search criteria' : 'No services available'}</p>
            </div>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(service => {
                  const baseUrl = "https://hf1bv21q-5049.uks1.devtunnels.ms";
                  const imageUrl = service.imageUrl
                    ? service.imageUrl.startsWith("http")
                      ? service.imageUrl
                      : `${baseUrl}${service.imageUrl}`
                    : "https://via.placeholder.com/300x200?text=Service";
                  
                  return (
                    <tr key={service.ser_id}>
                      <td>
                        <img 
                          src={imageUrl} 
                          alt={service.seR_Name}
                          className="service-image"
                          width="20"
                          height="20"
                        />
                      </td>
                      <td className='g'>{service.seR_Name}</td>
                      <td>{service.category}</td>
                      <td>{service.description}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleOpenModal(service)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(service.ser_id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedService ? 'Edit Service' : 'Add New Service'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.seR_Name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Upload an image from your device
              </Form.Text>
            </Form.Group>

            {selectedImage && (
              <div className="mb-3">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: '200px' }}
                />
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary " onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                {selectedService ? 'Update' : 'Create'} Service
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageServicesPage;