import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Calendar2Check, CurrencyDollar, Person, Eye, ArrowLeft } from 'react-bootstrap-icons';
import './BookingSummmaries.css';

const BookingSummaries = () => {
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        console.log('Fetching bookings with token authentication');
        
        const response = await fetch(`https://hf1bv21q-5049.uks1.devtunnels.ms/api/Booking/user/summaries`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received bookings data:', data);
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format - expected array');
        }
        
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
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
    if (price === null || price === undefined) return 'N/A';
    return typeof price === 'number' ? price.toFixed(2) : price;
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'completed':
        return <Badge bg="info">Completed</Badge>;
      default:
        return <Badge bg="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  // Handle row click to navigate to booking details
  const handleRowClick = (bookingId) => {
    navigate(`/booking-summary/${bookingId}`);
  };

  const handleBackToServices = () => {
    navigate('/services');
  };

  if (loading) {
    return (
      <Container className="bookings-container py-5">
        <Card className="bookings-card">
          <Card.Body className="text-center">
            <Spinner animation="border" role="status" size="lg">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading your bookings...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="bookings-container py-5">
        <Card className="bookings-card">
          <Card.Body className="text-center">
            <Alert variant="danger">
              <Alert.Heading>Error Loading Bookings</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="bookings-container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="bookings-title">
          <Calendar2Check className="me-2" />
          My Bookings
        </h2>
        <Button 
          variant="outline-primary"
          onClick={handleBackToServices}
        >
          <ArrowLeft className="me-1" /> Back to Services
        </Button>
      </div>

      <Card className="bookings-card shadow-sm">
        <Card.Body>
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <Calendar2Check size={64} className="text-muted mb-3" />
              <h4 className="text-muted">No Bookings Found</h4>
              <p className="text-muted">You haven't made any bookings yet.</p>
              <Button variant="primary" onClick={handleBackToServices}>
                Browse Services
              </Button>
            </div>
          ) : (
            // Replace the table section in your BookingSummaries component with this:

<div className="table-responsive">
  <Table hover className="bookings-table mb-0">
    <thead className="table-light">
      <tr>
          <th>
          
          Index
        </th>
        <th>
          <Person className="me-1" />
          Technician
        </th>
        <th>
          <Calendar2Check className="me-1" />
          Date & Time
        </th>
        <th>Status</th>
        <th>
          <CurrencyDollar className="me-1" />
          Price
        </th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map((booking, index) => (
        <tr 
          key={booking.bookingId || index} 
          className="booking-row"
          data-status={booking.bookingStatus?.toLowerCase()}
          onClick={() => handleRowClick(booking.bookingId)}
          style={{ cursor: 'pointer' }}
        >
          
          <td>
            <div className="technician-info">
              <strong>{booking.technicianName || 'Not assigned'}</strong>
              {booking.userName && (
                <div className="text-muted small">User: {booking.userName}</div>
              )}
            </div>
          </td>
          <td>
            <div className="booking-date">
              {formatDate(booking.bookingDate)}
            </div>
          </td>
          <td>
            {getStatusBadge(booking.bookingStatus)}
          </td>
          <td>
            <span className="booking-price text-success fw-bold">
              ${formatPrice(booking.price)}
            </span>
          </td>
          <td>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(booking.bookingId);
              }}
            >
              <Eye className="me-1" />
              View
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>
          )}
        </Card.Body>
      </Card>

      <div className="bookings-summary mt-4">
        <Card className="summary-card">
          <Card.Body>
            <div className="row text-center">
              <div className="col-md-3">
                <div className="summary-stat">
                  <h3 className="text-primary">{bookings.length}</h3>
                  <p className="text-muted mb-0">Total Bookings</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="summary-stat">
                  <h3 className="text-success">
                    {bookings.filter(b => b.bookingStatus?.toLowerCase() === 'confirmed').length}
                  </h3>
                  <p className="text-muted mb-0">Confirmed</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="summary-stat">
                  <h3 className="text-warning">
                    {bookings.filter(b => b.bookingStatus?.toLowerCase() === 'pending').length}
                  </h3>
                  <p className="text-muted mb-0">Pending</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="summary-stat">
                  <h3 className="text-info">
                    {bookings.filter(b => b.bookingStatus?.toLowerCase() === 'completed').length}
                  </h3>
                  <p className="text-muted mb-0">Completed</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default BookingSummaries;