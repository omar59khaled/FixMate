import React, { useState, useEffect } from "react";
import "./HomePage.css";
import ImageClassificationSection from '../../components/ImageClassificationSection/ImageClassificationSection'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import {
  faTools,
  faHammer,
  faTruckMoving,
  faBroom,
  faTree,
  faWrench,
  faPaintRoller,
  faFire,
  faSearch,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

import assembly from '../../assets/images/assembly.jpg'
import assembly2 from '../../assets/images/the-best-tv-mounts.jpg'
import assembly3 from '../../assets/images/roof_roofing_asphalt_shingle_repair_replacement_new_roofer_remove_removal_shutterstock_134922203.webp'
import assembly4 from '../../assets/images/home repairs.webp'

const services = [
  {
    id: "assembly",
    name: "Assembly",
    icon: faTools,
    image: assembly,
    keywords: ["General Furniture Assembly", "IKEA Assembly", "Crib Assembly", "PAX Assembly", "Bookshelf Assembly", "Desk Assembly"],
    description: "Professional furniture assembly services with expert precision and care for all your home furnishing needs.",
  },
  {
    id: "mounting",
    name: "Mounting",
    icon: faHammer,
    image: assembly2,
    keywords: ["TV Mounting", "Shelf Mounting", "Wall Decor Mounting"],
    description: "Securely mount TVs, shelves, and wall decor with expert precision and professional-grade tools.",
  },
  {
    id: "Outdoor Help",
    name: "Outdoor Help",
    icon: faTree,
    image: assembly3,
    keywords: ["Gardening", "Lawn", "Weed"],
    description: "Transform your outdoor spaces with professional gardening, lawn care, and landscaping services.",
  },
  {
    id: "Home Repairs",
    name: "Home Repairs",
    icon: faWrench,
    image: assembly4,
    keywords: ["Fixing", "Plumbing", "Electrical"],
    description: "Comprehensive home repair solutions for plumbing, electrical, and general maintenance needs.",
  },
];

const HomeServices = () => {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [searchValue, setSearchValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Add search functionality here
    console.log("Searching for:", searchValue);
  };

  const handleImageClassificationClick = () => {
    // Navigate to image classification page
    // Replace this with your actual navigation logic (e.g., React Router)
    <ImageClassificationSection />
    // Or if using React Router: navigate('/image-classification');
  };
 
  return (
    <div className="homepage-container ">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-gradient-overlay"></div>
      </div>

      <div className="container">
        {/* Hero Section */}
        <div className={`hero-section ${isVisible ? 'animate-in' : ''}`}>
          <div className="row align-items-center min-vh-100">
            <div className="col-12">
              {/* Main Title */}
              <div className="hero-content text-center">
                <h1 className="hero-title">
                  Book trusted help for    
                  <span className="title-highlight ms-3"> Home Tasks</span>
                </h1>
                <p className="hero-subtitle">
                  Connect with skilled professionals for all your home service needs. 
                  From assembly to repairs, we've got you covered.
                </p>

                {/* Search Bar */}
                <div className="search-section">
                  <form onSubmit={handleSearchSubmit} className="search-form">
                    <div className="search-input-container">
                      <FontAwesomeIcon icon={faSearch} className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="What do you need help with?" 
                        className="search-input"
                        value={searchValue}
                        onChange={handleSearchChange}
                      />
                      <button type="submit" className="search-button">
                        Search
                      </button>
                    </div>
                  </form>
                </div>

                {/* Image Classification Button */}
                <div className="upload-section ms-0">
                 
                    <button 
                      className="image-classification-btn"
                      
                      title="Upload an image to identify your service needs"
                    >
                      <FontAwesomeIcon icon={faCamera} className="camera-icon" />
                      <Link to='/image-classify' className="text-white">Identify Service by Photo</Link>
                    </button>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section mt-0 pt-0">
          <div className="row mt-0 pt-0">
            <div className="col-12 mt-0 pt-0">
              <div className="section-header text-center mb-5 mt-0 pt-0">
                <h2 className="section-title">Our Services</h2>
                <p className="section-subtitle">Choose from our wide range of professional home services</p>
              </div>

              {/* Services Grid */}
              <div className="services-grid">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className={`service-card ${selectedService.id === service.id ? "service-active" : ""}`}
                    onClick={() => handleServiceSelect(service)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="service-icon-container">
                      <FontAwesomeIcon icon={service.icon} className="service-icon" />
                    </div>
                    <h3 className="service-name">{service.name}</h3>
                    <div className="service-hover-overlay">
                      <span>View Details</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Service Details */}
        {selectedService && (
          <div className="service-details-section">
            <div className="row">
              <div className="col-12">
                <div className="service-details-card">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <div className="service-image-container">
                        <img 
                          src={selectedService.image} 
                          alt={selectedService.name} 
                          className="service-image" 
                        />
                        <div className="image-overlay">
                          <div className="service-badge">
                            <FontAwesomeIcon icon={selectedService.icon} />
                            <span>{selectedService.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="service-content">
                        <h3 className="service-details-title">{selectedService.name}</h3>
                        <p className="service-description">{selectedService.description}</p>
                        
                        <div className="keywords-section">
                          <h4 className="keywords-title">Popular Services:</h4>
                          <div className="keywords-container">
                            {selectedService.keywords.map((keyword, index) => (
                              <button key={index} className="keyword-tag">
                                {keyword}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="cta-section">
                          <button className="btn btn-primary-modern btn-lg">
                            Book Now
                          </button>
                          <button className="btn btn-outline-modern btn-lg">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeServices;