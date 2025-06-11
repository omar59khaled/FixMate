// src/components/BookingForm/BookingForm.jsx
import React, { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ service, selectedDate, selectedTime, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Booking submitted:', {
        service,
        selectedDate,
        selectedTime,
        formData
      });
      alert('Booking submitted successfully! We will contact you shortly.');
      onClose();
    } catch (error) {
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Service Summary */}
        <div className="col-12">
          <div className="alert alert-info">
            <h6 className="mb-1">Booking Summary</h6>
            <p className="mb-0">
              {service.title} - {selectedDate} at {selectedTime}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Information */}
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="col-12">
          <label className="form-label">Service Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Additional Notes */}
        <div className="col-12">
          <label className="form-label">Additional Notes</label>
          <textarea
            className="form-control"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        {/* Submit Buttons */}
        <div className="col-12">
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;