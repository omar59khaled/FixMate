import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import './ServiceDetails.css';
import TechnicianDrawer from '../../components/TechnicianDrawer/TechnicianDrawer';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for booking flow
  const [showTechnicianDrawer, setShowTechnicianDrawer] = useState(false);
  
  // New states for price quote request functionality
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  
  // Function to check if quotes have been requested for this service
  const checkQuoteRequestStatus = () => {
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      return false;
    }
    
    // Check localStorage for this specific service request
    const requestedServices = JSON.parse(localStorage.getItem('requestedServices') || '[]');
    return requestedServices.includes(parseInt(id));
  };
  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        // Fetch all services
        const response = await fetch('https://hf1bv21q-5049.uks1.devtunnels.ms/api/services/services');
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const allServices = await response.json();
        
        // Find the specific service by ID
        const foundService = allServices.find(service => service.ser_id === parseInt(id));
        
        if (foundService) {
          setService(foundService);
        } else {
          throw new Error('Service not found');
        }
        
        // Check if user has already requested quotes for this service
        const hasRequestedQuotes = checkQuoteRequestStatus();
        setRequestSent(hasRequestedQuotes);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  // Function to request price quotes from technicians
  const handleRequestPriceQuotes = async () => {
    // Get auth token from localStorage
    const userToken = localStorage.getItem('userToken');
    
    if (!userToken) {
      alert("Please login to request price quotes");
      return;
    }
    
    setRequestLoading(true);
    setRequestError(null);
    
    try {
      const response = await fetch('https://hf1bv21q-5049.uks1.devtunnels.ms/api/Booking/start-booking-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          serviceId: parseInt(id)
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      // Check if the response is JSON or plain text
      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Handle text response (including Arabic text)
        result = await response.text();
      }
      
      console.log("Price quote request sent:", result);
      
      // Save this service ID to localStorage to persist the request status
      const requestedServices = JSON.parse(localStorage.getItem('requestedServices') || '[]');
      if (!requestedServices.includes(parseInt(id))) {
        requestedServices.push(parseInt(id));
        localStorage.setItem('requestedServices', JSON.stringify(requestedServices));
      }
      
      setRequestSent(true);
      setRequestLoading(false);
    } catch (err) {
      console.error("Error requesting price quotes:", err);
      setRequestError(err.message);
      setRequestLoading(false);
    }
  };

  const handleBookNowClick = () => {
    setShowTechnicianDrawer(true);
  };

  // Modified to handle booking completion with navigation
  const handleBookingComplete = (bookingId) => {
    console.log("Booking completed with ID:", bookingId);
    
    // Remove this service from requestedServices when booking is complete
    const requestedServices = JSON.parse(localStorage.getItem('requestedServices') || '[]');
    const updatedServices = requestedServices.filter(serviceId => serviceId !== parseInt(id));
    localStorage.setItem('requestedServices', JSON.stringify(updatedServices));
    
    // Navigate to booking summary page with booking ID
    navigate(`/booking-summary/${bookingId}`);
  };

  const handleBackToServices = () => {
    navigate('/services');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading service details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading service details</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/services">
              <Button variant="outline-danger">
                Return to Services
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <Alert.Heading>Service Not Found</Alert.Heading>
          <p>The service you are looking for does not exist or has been removed.</p>
          <div className="mt-3">
            <Link to="/services">
              <Button variant="outline-warning">
                Return to Services
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  // Ensure the image URL is correct
  const baseUrl = "https://hf1bv21q-5049.uks1.devtunnels.ms";
  const imageUrl = service.imageUrl
    ? service.imageUrl.startsWith("http")
      ? service.imageUrl
      : `${baseUrl}${service.imageUrl}`
    : "https://via.placeholder.com/600x400?text=Service+Image";

  return (
    <div className="service-details-page">
      <Container className="py-5">
        {/* Back to Services Button */}
        <div className="mb-4">
          <Link to="/services">
            <Button variant="outline-success" size="sm">
              <ArrowLeft /> Back to Services
            </Button>
          </Link>
        </div>

        <Card className="service-detail-card">
          <Card.Img 
            variant="top" 
            src={imageUrl} 
            alt={service.seR_Name} 
            className="service-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=Service+Image';
            }}
          />
          <Card.Body className="no-scroll">
            <div className="service-category-badge">
              {service.category}
            </div>
            <Card.Title className="service-title">{service.seR_Name}</Card.Title>
            
            <hr />
            
            <h5>Description</h5>
            <Card.Text className="service-description">
              {service.description}
            </Card.Text>

            <div className="mt-4">
              {/* Conditionally render buttons based on quote request status */}
              {!requestSent ? (
                <Button 
                  variant="success"
                  className=" btn w-100 rounded-3 mb-3 request-btnn"
                  onClick={handleRequestPriceQuotes}
                  disabled={requestLoading}
                >
                  {requestLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2 "
                      />
                      Requesting Prices...
                    </>
                  ) : (
                    "Request Price Quotes"
                  )}
                </Button>
              ) : (
                <>
                  <Alert variant="success" className="mb-3">
                    <Alert.Heading className="h6">Price Quotes Requested!</Alert.Heading>
                    <p className="mb-0 small">
                      Technicians have been notified. You can now proceed to book the service.
                    </p>
                  </Alert>
                  <Button 
                    variant="success" 
                    className="btn  w-100 rounded-3 book-service-btn"
                    onClick={handleBookNowClick}
                  >
                    Book Now
                  </Button>
                </>
              )}
              
              {requestError && (
                <Alert variant="danger" className="mt-3">
                  Error: {requestError}. Please try again.
                </Alert>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Technician Selection Drawer */}
      <TechnicianDrawer
        show={showTechnicianDrawer}
        onHide={() => setShowTechnicianDrawer(false)}
        serviceId={service?.ser_id}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  );
};

export default ServiceDetails;
