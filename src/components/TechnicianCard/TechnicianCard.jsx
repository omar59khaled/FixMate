import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { StarFill, CurrencyDollar } from 'react-bootstrap-icons';
import './TechnicianCard.css'; // Assuming you have some styles

const TechnicianCard = ({ technician, selected, onSelect, offeredPrice }) => {
  // Handle undefined or null rating with a default value
  const rating = technician.averageRating !== undefined && technician.averageRating !== null
    ? technician.averageRating.toFixed(1)
    : 'N/A';

  return (
    <Card 
      className={`technician-card mb-3 ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{technician.name}</h5>
            <p className="text-muted mb-1">
              {technician.specialization || 'General Technician'}
            </p>
            
            {/* Display offered price if available */}
            {offeredPrice !== null && offeredPrice !== undefined && (
              <div className="mt-1 text-success">
                <CurrencyDollar className="me-1" />
                <strong>Offered Price: ${offeredPrice.toFixed(2)}</strong>
              </div>
            )}
          </div>
          
          <div className="rating-badge">
            {rating !== 'N/A' ? (
              <Badge bg="warning" className="d-flex align-items-center">
                <StarFill className="me-1" />
                {rating}
              </Badge>
            ) : (
              <Badge bg="secondary">No ratings yet</Badge>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TechnicianCard