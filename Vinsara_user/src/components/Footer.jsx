import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/LogoFoot.svg";
import { useCategories } from "../hooks/queries/categories";
import VinsaraLogo from "../assets/vinsaralogo.svg";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    message: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Allows formats: +91XXXXXXXXXX or XXXXXXXXXX (10 digits)
    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const validateContact = (contact) => {
    // Check if it's an email or phone number
    if (validateEmail(contact)) {
      return { isValid: true, type: "email" };
    }
    if (validatePhone(contact)) {
      return { isValid: true, type: "phone" };
    }
    return { isValid: false, type: "invalid" };
  };

  const validateMessage = (message) => {
    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 500) {
      return {
        isValid: false,
        message: "Message cannot exceed 500 characters",
      };
    }
    return { isValid: true, message: trimmedMessage };
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    // Trim all form values
    const trimmedForm = {
      name: feedbackForm.name.trim(),
      phone: feedbackForm.phone.trim(),
      message: feedbackForm.message.trim(),
    };

    // Check for empty fields
    if (Object.values(trimmedForm).some((value) => value === "")) {
      toast.error("Please fill all the fields");
      return;
    }

    // Validate contact (email or phone)
    const contactValidation = validateContact(trimmedForm.phone);
    if (!contactValidation.isValid) {
      toast.error("Please enter a valid email address or phone number");
      return;
    }

    // Validate message
    const messageValidation = validateMessage(trimmedForm.message);
    if (!messageValidation.isValid) {
      toast.error(messageValidation.message);
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: trimmedForm.name,
      message: messageValidation.message,
    };

    // Add email or phone based on validation
    if (contactValidation.type === "email") {
      submitData.email = trimmedForm.phone;
    } else {
      submitData.phone = trimmedForm.phone;
    }

    // Submit the form
    submitFeedback(submitData, {
      onSuccess: () => {
        toast.success("Feedback submitted successfully");
        // Reset form
        setFeedbackForm({
          name: "",
          phone: "",
          message: "",
        });
      },
      onError: () => {
        toast.error("Failed to submit feedback");
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setCategories(categoriesData?.envelop?.data);
  }, [categoriesData]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      {/* Feedback Section */}
      <div className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-content-text">
            <h2>We Value Your Feedback</h2>
            <h3>Help Us To Serve You Better!</h3>
          </div>
          <form
            className="newsletter-content-form"
            onSubmit={handleFeedbackSubmit}
          >
            <div className="form-row">
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={feedbackForm.name}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
              <input
                type="text"
                placeholder="Email or Phone number"
                name="phone"
                value={feedbackForm.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <textarea
              placeholder="Tell us about your experience"
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

      {/* <div className="footer-divider"></div> */}

      {/* Main Footer */}
      <div className="footer-main">
        {/* Logo Section */}
        <div className="footer-logo">
          <img src={VinsaraLogo} alt="Vinsara Logo" />
        </div>

        {/* Navigation Links */}
        <div className="footer-navigation">
          <Link to="/about" className="nav-link" onClick={scrollToTop}>
            About Us
          </Link>
          <Link to="/terms" className="nav-link" onClick={scrollToTop}>
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="nav-link" onClick={scrollToTop}>
            Privacy Policy
          </Link>
          <Link to="/refund" className="nav-link" onClick={scrollToTop}>
            Refund Policy
          </Link>
          <Link to="/contact" className="nav-link" onClick={scrollToTop}>
            Contact Us
          </Link>
        </div>

        {/* Divider */}
        <div className="footer-divider-main"></div>

        {/* Address Section */}
        <div className="footer-address">
          <p>
            Vinsara Ventures Llp 38/1553/A, Kannancheri (Po) Kallai, Kozhikode
            Kerala, 673003
          </p>
          <p>7012617749</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span className="copyright">
            © 2025 <span className="brand-highlight">Vinsara</span>. All rights
            reserved
          </span>
          <div className="separator"></div>
          <a href="https://www.instagram.com/vinsara.in/" className="social-link">
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61578314360159"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <div className="separator"></div>
          <span className="powered-by">
            Powered by <a href="https://www.instagram.com/marketlube/?hl=en" className="brand-highlight" target="_blank" rel="noopener noreferrer"  style={{textDecoration: "none"}}>Marketlube</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
