// HomeRepairContact.jsx
import React, { useState } from 'react';
import './ContactUs.css';

const HomeRepairContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    urgency: 'normal',
    preferredDate: '',
    preferredTime: '',
    description: '',
    budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const serviceTypes = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Roofing',
    'HVAC',
    'General Maintenance',
    'Other'
  ];

  return (
    <div className="contact-container">
      <div className="contact-form-wrapper">
        <h1>Request Home Repair Service</h1>
        <p className="form-subtitle">Tell us about your repair needs and we'll get back to you quickly!</p>
        
        <form onSubmit={handleSubmit} className="repair-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Service Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="serviceType">Type of Service *</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency Level</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferredDate">Preferred Date</label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferredTime">Preferred Time</label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
              >
                <option value="">Select time</option>
                <option value="morning">Morning (8AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 4PM)</option>
                <option value="evening">Evening (4PM - 8PM)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget">Estimated Budget</label>
              <input
                type="text"
                id="budget"
                name="budget"
                placeholder="Optional"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Describe the Issue *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Please provide details about the repair needed..."
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Request Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeRepairContact;