import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { CheckCircleFill, Calendar2Check, ArrowLeft, CurrencyDollar, Person } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './BookingSummary.css';

const BookingSummary = () => {
  const { bookingId } = useParams(); // Get booking ID from URL params
  const navigate = useNavigate();
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      // Don't fetch if no bookingId provided
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching booking data for ID:', bookingId);
        
        const response = await fetch(`https://hf1bv21q-5049.uks1.devtunnels.ms/api/Booking/${bookingId}/summary`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received booking data:', data);
        
        // Validate required fields
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }
        
        setBookingData(data);
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Price not available';
    return typeof price === 'number' ? price.toFixed(2) : price;
  };

  // Get status display properties
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          icon: <CheckCircleFill size={80} className="text-success" />,
          title: 'Booking Confirmed!',
          variant: 'success'
        };
      case 'pending':
        return {
          icon: <CheckCircleFill size={80} className="text-success" />,
          title: 'Booking Pending',
          variant: 'success'
        };
      case 'cancelled':
        return {
          icon: <CheckCircleFill size={80} className="text-danger" />,
          title: 'Booking Cancelled',
          variant: 'danger'
        };
      default:
        return {
          icon: <CheckCircleFill size={80} className="text-info" />,
          title: 'Booking Status',
          variant: 'info'
        };
    }
  };

  const handleBackToServices = () => {
    navigate('/services');
  };

  if (loading) {
    return (
      <Container className="booking-confirmation-container py-5">
        <Card className="booking-confirmation-card">
          <Card.Body className="text-center">
            <Spinner animation="border" role="status" size="lg">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading booking details...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="booking-confirmation-container py-5">
        <Card className="booking-confirmation-card">
          <Card.Body className="text-center">
            <Alert variant="danger">
              <Alert.Heading>Error Loading Booking</Alert.Heading>
              <p>Unable to load booking details: {error}</p>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!bookingData) {
    return (
      <Container className="booking-confirmation-container py-5">
        <Card className="booking-confirmation-card">
          <Card.Body className="text-center">
            <Alert variant="warning">
              <Alert.Heading>No Booking Found</Alert.Heading>
              <p>No booking data available.</p>
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const statusDisplay = getStatusDisplay(bookingData.bookingStatus);

  return (
    <Container className="booking-confirmation-container py-5">
      <Card className="booking-confirmation-card">
        <Card.Body className="text-center no-scroll">
          <div className="success-icon mb-4">
            {statusDisplay.icon}
          </div>
          
          <h2 className="mb-4">{statusDisplay.title}</h2>
          
          <div className="booking-info mb-4">
           
            
            <p className="lead">
              Your booking with technician <span className='text-success'><strong>{bookingData.technicianName || 'Not assigned'}</strong></span>
              {bookingData.bookingStatus === 'confirmed' ? ' has been confirmed' : 
               bookingData.bookingStatus === 'pending' ? ' is pending confirmation' : 
               ` is ${bookingData.bookingStatus || 'unknown'}`}.
            </p>
          </div>
          
          <div className="booking-details mt-4">
            <div className="booking-date mb-3">
              <Calendar2Check size={24} className="me-2" />
              <span>{formatDate(bookingData.bookingDate)}</span>
            </div>
            
            <div className="booking-price mb-2 mt-3 text-success">
              <CurrencyDollar size={24} className="me-1" />
              <span><strong>Price:</strong> <span className='ms-1 ps-0'>${formatPrice(bookingData.price)}</span></span>
            </div>
          
          </div>
          
          <div className="booking-actions mt-5">
            <Button 
              variant={`outline-${statusDisplay.variant}`}
              className="me-3 btn "
              onClick={handleBackToServices}
            >
              <ArrowLeft className="me-1" /> Back to Services
            </Button>
            
            <Link to="/bookings">
              <Link to= "/Booking-Summmaries"className='btn btn-success' variant={statusDisplay.variant}>
                View My Bookings
              </Link>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingSummary;