import React, { useState, useEffect } from 'react';
import { Offcanvas, Spinner, Alert, Form } from 'react-bootstrap';
import TechnicianCard from '../TechnicianCard/TechnicianCard';
import DateTimePicker from '../DataTimePicker/DataTimePicker';

const TechnicianDrawer = ({ 
  show, 
  onHide, 
  serviceId, 
  onBookingComplete,
  userId 
}) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [specialization, setSpecialization] = useState(""); // Default value, can be changed
  const [technicianOffers, setTechnicianOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Fetch technicians when drawer opens
  useEffect(() => {
    if (show && serviceId) {
      fetchTechnicians();
      fetchTechnicianOffers();
    }
  }, [show, serviceId, specialization]);

  const fetchTechnicians = async () => {
    setLoading(true);
    console.log("Fetching technicians for serviceId:", serviceId);
    try {
      const response = await fetch(
        `https://hf1bv21q-5049.uks1.devtunnels.ms/api/Technician/GetTechniciansByService/${serviceId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched technicians:", data);
      
      // Validate and sanitize the data
      const sanitizedData = Array.isArray(data) ? data.map(tech => {
        return {
          technicianId: tech.technicianId || Date.now(), // Fallback ID if missing
          name: tech.name || "Unknown Technician",
          specialization: tech.specialization || "",
          averageRating: tech.averageRating // Will be handled in TechnicianCard
        };
      }) : [];
      
      setTechnicians(sanitizedData);
    } catch (err) {
      console.error("Error fetching technicians:", err);
      setError("Failed to load technicians. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch technician offers
  const fetchTechnicianOffers = async () => {
    try {
      const response = await fetch(
        `https://hf1bv21q-5049.uks1.devtunnels.ms/api/User/offers?serviceId=${serviceId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Use token from localStorage
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched technician offers:", data);
      
      if (Array.isArray(data)) {
        setTechnicianOffers(data);
      }
    } catch (err) {
      console.error("Error fetching technician offers:", err);
      // Don't set an error state here to avoid disrupting main functionality
    }
  };

  const handleTechnicianSelect = (technician) => {
    setSelectedTechnician(technician);
    
    // Find the matching offer for this technician
    const matchingOffer = technicianOffers.find(
      offer => offer.technicianName === technician.name
    );
    
    setSelectedOffer(matchingOffer || null);
  };

  const handleDateChange = (date) => {
    setBookingDate(date);
  };

  const handleBookingSubmit = async () => {
    if (!selectedTechnician || !selectedOffer) {
      setError("Please select a technician with an available offer");
      return;
    }

    setBookingInProgress(true);
    
    try {
      // Use the confirm-booking endpoint with offerId
      const bookingData = {
        offerId: selectedOffer.offerId
      };
      
      console.log("Submitting booking confirmation with data:", bookingData);
      
      const response = await fetch(
        "https://hf1bv21q-5049.uks1.devtunnels.ms/api/Booking/confirm-booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Use token from localStorage
          },
          body: JSON.stringify(bookingData)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error: ${response.status}`);
      }
      
      const responseData = await response.json().catch(() => ({}));
      console.log("Booking response:", responseData);
      
      // Extract booking ID from response
      // The API should return the booking ID in the response
      // Adjust this based on your actual API response structure
      const bookingId = responseData.bookingId || responseData.id || responseData.BookingId;
      
      if (!bookingId) {
        throw new Error("Booking ID not returned from server");
      }
      
      // Close the drawer first
      onHide();
      
      // Call the onBookingComplete callback with just the booking ID
      onBookingComplete(bookingId);
      
    } catch (err) {
      console.error("Error confirming booking:", err);
      setError("Failed to confirm booking. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  // Filter technicians based on specialization if entered
  const filteredTechnicians = specialization 
    ? technicians.filter(tech => 
        tech.specialization && 
        tech.specialization.toLowerCase().includes(specialization.toLowerCase())
      )
    : technicians;

  // Map the offers data to technicians based on name
  const techniciansWithOffers = filteredTechnicians.map(tech => {
    const matchingOffer = technicianOffers.find(offer => offer.technicianName === tech.name);
    return {
      ...tech,
      offeredPrice: matchingOffer ? matchingOffer.offeredPrice : null,
      offerId: matchingOffer ? matchingOffer.offerId : null
    };
  });

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Select a Technician</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

       
     

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Loading technicians...</p>
          </div>
        ) : techniciansWithOffers.length === 0 ? (
          <Alert variant="info">
            {specialization 
              ? "No technicians match the specialization filter." 
              : "No technicians found for this service."}
          </Alert>
        ) : (
          <>
            <div className="technicians-list">
              {techniciansWithOffers.map((technician) => (
                <TechnicianCard
                  key={technician.technicianId}
                  technician={technician}
                  selected={selectedTechnician?.technicianId === technician.technicianId}
                  onSelect={() => handleTechnicianSelect(technician)}
                  offeredPrice={technician.offeredPrice}
                />
              ))}
            </div>

            {selectedTechnician && (
              <div className="mt-4">
               
                
                {selectedOffer && (
                  <Alert variant="info" className="mt-3">
                    You're booking at the offered price of ${selectedOffer.offeredPrice.toFixed(2)}
                  </Alert>
                )}
                
                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-success"
                    onClick={handleBookingSubmit}
                    disabled={bookingInProgress || !selectedOffer}
                  >
                    {bookingInProgress ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default TechnicianDrawer;