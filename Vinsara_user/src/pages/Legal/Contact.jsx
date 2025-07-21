import React from "react";
import { FiMail, FiPhone } from "react-icons/fi";

const Contact = () => (
  <div className="contact-page">
    <section className="contact-hero">
      <div className="contact-hero-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="64" height="64" rx="16" fill="#fff6e0" />
          <path
            d="M20 24h24a2 2 0 012 2v12a2 2 0 01-2 2H20a2 2 0 01-2-2V26a2 2 0 012-2zm0 0l12 9 12-9"
            stroke="#e6b800"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h1>Contact Us</h1>
    </section>
    <section className="legal-content contact-content">
      <h2>We're here to help!</h2>
      <p className="contact-description">
        Have a question, need support, or want to connect with us? Reach out
        anytime using the details below. Our team is always happy to assist you.
      </p>
      <div className="contact-info-bg">
        <div className="contact-info-list">
          <div className="contact-info-item">
            <FiMail className="contact-icon" />
            <span>
              <a href="mailto:vinsaraventuresllp@gmail.com">
                vinsaraventuresllp@gmail.com
              </a>
            </span>
          </div>
          <div className="contact-info-item">
            <FiPhone className="contact-icon" />
            <span>
              <a href="tel:+917012617749">+91 70126 17749</a>
            </span>
          </div>
          <div className="contact-info-item">
            <FiPhone className="contact-icon" />
            <span>
              <a href="tel:+919136205709">+91 91362 05709</a>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
