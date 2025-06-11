import React from "react";

const Footer = () => {
  return (
    <>
      <style jsx>{`
        .modern-footer {
          background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
          color: #2c3e50;
          padding: 60px 0 30px;
          margin-top: 80px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #dee2e6;
        }

        .modern-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(46,109,74,0.03)"/><circle cx="75" cy="75" r="1" fill="rgba(46,109,74,0.02)"/><circle cx="50" cy="10" r="0.5" fill="rgba(46,109,74,0.025)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.4;
        }

        .footer-content {
          position: relative;
          z-index: 1;
        }

        .footer-wave {
          position: absolute;
          top: -50px;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(180deg, rgba(46, 109, 74, 0.05) 0%, rgba(46, 109, 74, 0.1) 100%);
          clip-path: polygon(0 50%, 100% 0%, 100% 100%, 0% 100%);
        }

        .footer-section-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 25px;
          color: #2E6D4A;
          position: relative;
        }

        .footer-section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #48A268, transparent);
          border-radius: 2px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .footer-link {
          color: #6c757d;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 400;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 0;
        }

        .footer-link:hover {
          color: #2E6D4A;
          padding-left: 8px;
          text-decoration: none;
        }

        .footer-link::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          background: #48A268;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .footer-link:hover::before {
          opacity: 1;
        }

        .social-section {
          background: rgba(46, 109, 74, 0.05);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(46, 109, 74, 0.1);
          margin-bottom: 20px;
        }

        .social-text {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 20px;
          color: #2E6D4A;
        }

        .social-icons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .social-icon {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .social-icon:hover {
          background: #48A268;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(72, 162, 104, 0.3);
        }

        .app-download-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .app-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .app-store-buttons {
          display: flex;
          gap: 15px;
          flex-direction: column;
        }

        .app-store-btn {
          display: inline-block;
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .app-store-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }

        .app-store-btn img {
          width: 140px;
          height: auto;
          display: block;
          filter: brightness(1.1);
        }

        .footer-bottom {
          border-top: 1px solid rgba(46, 109, 74, 0.15);
          margin-top: 50px;
          padding-top: 25px;
          text-align: center;
        }

        .footer-bottom-text {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .modern-footer {
            padding: 40px 0 20px;
            margin-top: 60px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .social-section,
          .app-download-section {
            padding: 25px 20px;
          }

          .app-store-buttons {
            align-items: flex-start;
          }

          .app-store-btn img {
            width: 120px;
          }

          .social-icons {
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .footer-section-title {
            font-size: 1.1rem;
          }

          .social-section,
          .app-download-section {
            padding: 20px 15px;
          }
        }
      `}</style>

      <footer className="modern-footer">
        <div className="footer-wave"></div>
        
        <div className="container footer-content">
          {/* Social Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="social-section text-center">
                <h6 className="social-text">Follow us! We're friendly:</h6>
                <div className="social-icons justify-content-center">
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.566-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.742.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.162-1.499-.69-2.436-2.878-2.436-4.640 0-3.78 2.747-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="footer-grid">
            {/* Discover Section */}
            <div className="footer-section">
              <h6 className="footer-section-title">Discover</h6>
              <ul className="footer-links">
                {[
                  "Become a Technichan",
                  "Services By City", 
                  "Services Nearby",
                  "All Services",
                  "Help"
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div className="footer-section">
              <h6 className="footer-section-title">Company</h6>
              <ul className="footer-links">
                {[
                  "About Us",
                  "Careers", 
              
                  "Press",
                  "for Good",
                  "Blog",
                  "Terms & Privacy",
                  
                 
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* App Download Section */}
            <div className="footer-section">
              <div className="app-download-section">
                <h6 className="footer-section-title text-dark">Download our app</h6>
                <p className="app-description text-dark">
                  Tackle your to-do list wherever you are with our mobile app.
                </p>
                <div className="app-store-buttons">
                  <a href="#" className="app-store-btn">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                    />
                  </a>
                  <a href="#" className="app-store-btn">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="footer-bottom-text">
              © 2025 FixMate, All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;