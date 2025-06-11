import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const DateTimePicker = ({ selectedDate, onDateChange }) => {
  // Get current date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Format the current selected date for the date input
  const formattedDate = selectedDate.toISOString().split('T')[0];
  
  // Get hours and minutes for time input
  const hours = String(selectedDate.getHours()).padStart(2, '0');
  const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const handleDateChange = (e) => {
    const newDate = new Date(selectedDate);
    const [year, month, day] = e.target.value.split('-').map(Number);
    newDate.setFullYear(year);
    newDate.setMonth(month - 1); // JS months are 0-based
    newDate.setDate(day);
    onDateChange(newDate);
  };

  const handleTimeChange = (e) => {
    const newDate = new Date(selectedDate);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onDateChange(newDate);
  };

  return (
    <div className="datetime-picker">
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={formattedDate}
              onChange={handleDateChange}
              min={today}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              value={formattedTime}
              onChange={handleTimeChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default DateTimePicker;