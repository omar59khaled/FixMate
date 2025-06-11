import React, { useState, useRef, useEffect } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { FaUpload, FaImage, FaTimes } from 'react-icons/fa';
import './ImageClassificationSection.css';

const ImageClassificationSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showIssueCard, setShowIssueCard] = useState(false);
  const [issueData, setIssueData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Clear any error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // Create preview URL for the selected image
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    await uploadImage(selectedImage);
  };

  const uploadImage = async (imageFile) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('https://aa95-156-217-192-94.ngrok-free.app/classify/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Process the direct response from the classify endpoint
      const result = await response.json();
      setIssueData(result);
      setShowIssueCard(true);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Only use this if you specifically need to fetch the last classified issue separately
  const fetchLastIssue = async () => {
    try {
      const response = await fetch('https://aa95-156-217-192-94.ngrok-free.app/last_issue/');
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json(); // Parse the JSON response properly
      setIssueData(data);
      setShowIssueCard(true);
    } catch (error) {
      console.error('Error fetching last issue:', error);
      setError('Failed to fetch issue data: ' + error.message);
    }
  };

  const closeModal = () => {
    setShowIssueCard(false);
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelUpload = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="image-classification-container">
      <div className="upload-card">
        <h3 className="upload-title">Image Classification</h3>
        <p className="upload-description">Upload an image to classify potential issues</p>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <div className="upload-area" onClick={!selectedImage ? handleUploadClick : undefined}>
          {!previewImage ? (
            <div className="upload-placeholder">
              <FaUpload className="upload-icon" />
              <p>Click to select an image from your device</p>
            </div>
          ) : (
            <div className="preview-container">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="preview-image" 
              />
              <button 
                className="remove-image-btn" 
                onClick={cancelUpload}
                title="Remove image"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <div className="upload-actions">
          <Button 
            variant="secondary" 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="select-btn"
          >
            <FaImage className="btn-icon" /> Select Image
          </Button>
          
          <Button 
            
            onClick={handleSubmit}
            disabled={!selectedImage || isUploading}
            className="upload-btn"
          >
            {isUploading ? (
              <>
                <Spinner 
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> Uploading...
              </>
            ) : (
              <>
                <FaUpload className="btn-icon"/>Upload & Classify
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Modal Issue Card */}
      <Modal 
        show={showIssueCard} 
        onHide={closeModal} 
        centered
        size="lg"
        className="issue-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{ 'Issue Detection Results'}</Modal.Title>
        </Modal.Header>
       
        <Modal.Body>
          <div className="issue-details">
            <div className="detail-row">
              <strong>Predicted Class:</strong> 
              <span className={`status ${issueData?.predicted_class?.toLowerCase()}`}>
                {issueData?.predicted_class || 'N/A'}
              </span>
            </div>
            <div className="detail-row">
              <strong>Issue Category:</strong> 
              <span>{issueData?.issue_category || 'N/A'}</span>
            </div>
          </div>
        </Modal.Body>
       
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageClassificationSection;