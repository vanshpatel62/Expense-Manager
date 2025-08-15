// // import React, { useState } from "react";
import "../css/ContactPage.css";

function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: ""
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate form submission
//     setTimeout(() => {
//       setSubmitStatus('success');
//       setIsSubmitting(false);
//       setFormData({
//         name: "",
//         email: "",
//         subject: "",
//         message: ""
//       });
      
//       // Reset status after 5 seconds
//       setTimeout(() => {
//         setSubmitStatus(null);
//       }, 5000);
//     }, 2000);
//   };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for support and inquiries</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Get In Touch</h2>
            <p className="contact-description">
              Have questions about Smart Attendance? We're here to help! 
              Reach out to us through any of the channels below.
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="method-content">
                  <h3>Address</h3>
                  <p>Ahmedabad<br/>Gujarat</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="method-content">
                  <h3>Phone</h3>
                  <p>+91 9999999999</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="method-content">
                  <h3>Email</h3>
                  <p>smartattendance@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="method-content">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        
      </div>
    </div>
  );
}

export default ContactPage; 