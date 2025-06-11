import React from "react";
import './HowItWorks.css'
import image1 from'../../../assets/images/how-it-works-step-1.webp'
import image2 from'../../../assets/images/how-it-works-step-2.webp'
import image3 from'../../../assets/images/how-it-works-step-3.webp'
const HowItWorks = () => {
  return (
    <div className=" main ">
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold fs-1 fst-italic mb-4 mt-2">How it works</h2>
      <div className="row text-center">
        {/* Step 1 */}
        <div className="col-md-4 mb-4">
          <img
            src={image1} 
            alt="Describe Task"
            className="img-fluid mb-3"
            style={{ maxWidth: "100px" }}
          />
          <h5 className="fw-bold">1. Describe Your Task</h5>
          <p className="text-muted">
            Tell us what you need done, when and where it works for you.
          </p>
        </div>

        {/* Step 2 */}
        <div className="col-md-4 mb-4">
          <img
            src={image2}  // Replace with the correct path to your image in the assets folder
            alt="Choose Tasker"
            className="img-fluid mb-3"
            style={{ maxWidth: "100px" }}
          />
          <h5 className="fw-bold">2. Choose Your Tasker</h5>
          <p className="text-muted">
            Browse trusted Taskers by skills, reviews, and price. Chat with them to confirm details.
          </p>
        </div>

        {/* Step 3 */}
        <div className="col-md-4 mb-4">
          <img
            src={image3} // Replace with the correct path to your image in the assets folder
            alt="Get It Done"
            className="img-fluid mb-3"
            style={{ maxWidth: "100px" }}
          />
          <h5 className="fw-bold">3. Get It Done!</h5>
          <p className="text-muted">
            Your Tasker arrives and gets the job done. Pay securely and leave a review, all through TaskRabbit.
          </p>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default HowItWorks;
