import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/LogoFoot.svg";
import { useCategories } from "../hooks/queries/categories";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSubmitFeedback } from "../hooks/queries/feedback";


function Footer() {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { data: categoriesData } = useCategories();
  const { mutate: submitFeedback } = useSubmitFeedback();

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Allows formats: +91XXXXXXXXXX or XXXXXXXXXX (10 digits)
    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateMessage = (message) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      return { isValid: false, message: "Message must be at least 10 characters long" };
    }
    if (trimmedMessage.length > 500) {
      return { isValid: false, message: "Message cannot exceed 500 characters" };
    }
    return { isValid: true, message: trimmedMessage };
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    // Trim all form values
    const trimmedForm = {
      name: feedbackForm.name.trim(),
      phone: feedbackForm.phone.trim(),
      email: feedbackForm.email.trim(),
      message: feedbackForm.message.trim()
    };

    // Check for empty fields
    if (Object.values(trimmedForm).some(value => value === "")) {
      toast.error("Please fill all the fields");
      return;
    }

    // Validate email
    if (!validateEmail(trimmedForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone
    if (!validatePhone(trimmedForm.phone)) {
      toast.error("Please enter a valid Indian phone number");
      return;
    }

    // Validate message
    const messageValidation = validateMessage(trimmedForm.message);
    if (!messageValidation.isValid) {
      toast.error(messageValidation.message);
      return;
    }

    // Submit the trimmed and validated form
    submitFeedback({
      ...trimmedForm,
      message: messageValidation.message // Use the trimmed message
    }, {
      onSuccess: () => {
        toast.success("Feedback submitted successfully");
        // Reset form
        setFeedbackForm({
          name: "",
          phone: "",
          email: "",
          message: ""
        });
      },
      onError: () => {
        toast.error("Failed to submit feedback");
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    setCategories(categoriesData?.envelop?.data);
  }, [categoriesData]);
  
  return (
    <footer className="footer">
      {/* Feedback Section */}
      <div className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-content-text">
            <h2>We Value Your Feedback</h2>
            <h3>Help Us Serve You Better!</h3>
            <p>
              Your feedback helps us improve our services and enhance your shopping experience. <br />
              Share your thoughts with us!
            </p>
          </div>
          <form className="newsletter-content-form" onSubmit={handleFeedbackSubmit}>
            <input 
              type="text" 
              placeholder="Full name" 
              name="name"
              value={feedbackForm.name}
              onChange={handleInputChange}
              required
              maxLength={50}
            />
            <input 
              type="tel" 
              placeholder="Phone number" 
              name="phone"
              value={feedbackForm.phone}
              onChange={handleInputChange}
              required
              maxLength={13}
            />
            <input 
              type="email" 
              placeholder="Email address" 
              name="email"
              value={feedbackForm.email}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
            <textarea 
              placeholder="Your message" 
              name="message"
              value={feedbackForm.message}
              onChange={handleInputChange}
              required
              maxLength={500}
            ></textarea>
            <button type="submit">Send Feedback</button>
          </form>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Main Footer */}
      <div className="footer-main">
        {/* Brand Section */}
        <div className="footer-brand">
          <img src={Logo} alt="Mill Store Logo" />
        </div>

        <div className="footer-links-group">
          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              {categories?.map((category) => (
                <li
                  key={category._id}
                  onClick={() =>
                    navigate(`/products`, {
                      state: { selectedCategory: {
                        id: category._id,
                        name: category.name,
                      } },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section2">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#" className="footer-link">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Gift vouchers
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Our policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section3">
            <h4>Contact</h4>
            <ul>
              <li>
                <span>Northlux</span>
              </li>
              <li className="address">
                Triangle magnum 2 
              </li>
              <li className="address">
              Balan k Nair road, Ashokapuram 
              </li>
              <li className="address">
              Kozhikode,  673 006
              </li>
       
              <li>
                <a href="mailto:northlux@gmail.com">northlux@gmail.com</a>
              </li>
              <li>
                <a href="#">Support & FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="social-links">
          {/* <a href="#">
            <FaTwitter />
          </a> */}
          {/* <a href="https://www.facebook.com/" target="_blank">
            <FaFacebookF />
          </a> */}
          <a href="https://www.instagram.com/_northlux/" target="_blank">
            <FaInstagram />
          </a>
          {/* <a href="https://www.youtube.com/" target="_blank">
            <FaYoutube />
          </a> */}
        </div>

        <p>
          © 2025 <span className="footer-brand-name">Northlux</span> All rights
          reserved
        </p>

        <div className="powered-by">
          <span>
            Powered by{" "}
            <a href="https://www.instagram.com/marketlube/" target="_blank">
              Marketlube
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
