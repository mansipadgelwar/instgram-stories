import { useEffect, useState, useCallback } from "react";

export default function StoryViewer({ stories, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (stories.length === 0 || currentIndex >= stories.length) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories.length, handleNext]);

  const handlePrev = useCallback(() => {
    setLoading(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex >= stories.length - 1) {
      // If we're at the last story, close the viewer
      onClose();
      return;
    }
    setLoading(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, stories.length, onClose]);

  if (!stories[currentIndex]) return null;

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - touchStart;
    
    // Only allow pulling down, not up
    if (diff < 0) return;
    
    // Add resistance to the pull
    const resistance = 0.4;
    setTranslateY(diff * resistance);
  };

  const handleTouchEnd = () => {
    if (translateY > 150) {
      // If pulled down far enough, close the story
      onClose();
    }
    // Reset position
    setTranslateY(0);
    setTouchStart(null);
  };

  return (
    <div className="story-viewer">
      <button className="close-btn" onClick={onClose} aria-label="Close story">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div 
        className="story-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateY(${translateY}px)` }}>
        {loading && <div className="loader">Loading...</div>}
        <img
          src={stories[currentIndex].src}
          alt="story"
          className={`story-image ${loading ? "hidden" : ""}`}
          onLoad={() => setLoading(false)}
        />
        <div className="left-zone" onClick={handlePrev}></div>
        <div className="right-zone" onClick={handleNext}></div>
      </div>
    </div>
  );
}
