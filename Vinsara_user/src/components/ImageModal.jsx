import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiX } from "react-icons/fi";

const ImageModal = ({ isOpen, onClose, images, initialIndex = 0, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, currentIndex, isDragging, dragStart, imagePosition, zoomLevel]);

  const goToNext = () => {
    if (images && images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsZoomed(false);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const goToPrevious = () => {
    if (images && images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsZoomed(false);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setIsZoomed(false);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setImagePosition({ x: 0, y: 0 });
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Add boundaries to prevent dragging too far
      const maxOffset = 100 * (zoomLevel - 1);
      const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
      const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
      
      setImagePosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - imagePosition.x,
        y: touch.clientY - imagePosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      const maxOffset = 100 * (zoomLevel - 1);
      const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
      const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
      
      setImagePosition({ x: boundedX, y: boundedY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!images || images.length === 0) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="image-modal"
      closable={false}
      title={null}
          >
        <div className="image-modal-content">
          {/* Custom Header */}
          <div className="image-modal-header">
            <div className="image-modal-title">
              <span className="image-counter">
                {currentIndex + 1} of {images.length}
              </span>
            </div>
            <button className="image-modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>

          {/* Main Image */}
          <div className="image-modal-image-wrapper">
          <div 
            className={`image-modal-image-container ${isZoomed ? 'zoomed' : ''} ${isDragging ? 'dragging' : ''}`}
            style={{ 
              transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentIndex]}
              alt={`${productName} ${currentIndex + 1}`}
              className="image-modal-image"
              onDoubleClick={isZoomed ? resetZoom : handleZoomIn}
              draggable={false}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                className="image-modal-nav prev" 
                onClick={goToPrevious}
                disabled={images.length <= 1}
              >
                <FiChevronLeft />
              </button>
              <button 
                className="image-modal-nav next" 
                onClick={goToNext}
                disabled={images.length <= 1}
              >
                <FiChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="image-modal-controls">
          <div className="zoom-controls">
            <button 
              className="zoom-btn" 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
            >
              <FiZoomOut />
            </button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button 
              className="zoom-btn" 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
            >
              <FiZoomIn />
            </button>
          </div>
          
          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="image-modal-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal; 