import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import Slider from 'react-slick';


import './ServicesPage.css';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <Button variant="outline-success" className="slick-arrow slick-prev"><ArrowLeft /></Button>,
    nextArrow: <Button variant="outline-success" className="slick-arrow slick-next"><ArrowRight /></Button>,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://hf1bv21q-5049.uks1.devtunnels.ms/api/services/services');
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(service => service.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search term and selected category
    const filtered = services.filter(service => {
      const matchesSearch = service.seR_Name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? service.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
    
    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger" role="alert">
          Error loading services: {error}
        </div>
      </Container>
    );
  }

  return (
    <div className="services-page">
      <div className="services-hero  py-5">
        <Container>
          <h1 className="display-4 text-center text-dark  mb-4">Our Services</h1>
          <p className="lead text-center text-dark mb-5">Discover our range of professional services designed to meet your needs</p>
          
        
          <Row className="mb-4 justify-content-center">
            <Col md={6} lg={4}>
              <InputGroup>
                <Form.Control
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-label="Search services"
                />
                <Button variant="outline-success text-dark">
                  <Search />
                </Button>
              </InputGroup>
            </Col>
            <Col md={4} lg={3}>
              <Form.Select 
                value={selectedCategory} 
                onChange={handleCategoryChange}
                aria-label="Select service category"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
    
        {filteredServices.length === 0 ? (
          <div className="text-center py-5">
            <p>No services found matching your criteria.</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredServices.map((service) => {
              const baseUrl = "https://hf1bv21q-5049.uks1.devtunnels.ms";
              const imageUrl = service.imageUrl
                ? service.imageUrl.startsWith("http")
                  ? service.imageUrl
                  : `${baseUrl}${service.imageUrl}`
                : "https://via.placeholder.com/300x200?text=Service";

              return (
                <Col key={service.ser_id} xs={12} md={6} lg={4}>
                  
                      <Link to={`/services/${service.ser_id}`} className="">
                      <Card className="h-100 shadow-sm service-card">
                    <Card.Img
                      variant="top"
                      src={imageUrl}
                      alt={service.seR_Name}
                      className="service-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Service';
                      }}
                    />
                    <Card.Body>
                      <Card.Title className="service-title">{service.seR_Name}</Card.Title>
                      <Card.Text className="service-category text-muted">
                         {service.category}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0 d-flex justify-content-between">
                   
                    </Card.Footer>
                  </Card>
                      </Link>
                   
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ServicesPage;