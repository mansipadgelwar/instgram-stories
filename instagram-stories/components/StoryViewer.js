import { useEffect, useState, useCallback } from "react";

export default function StoryViewer({ stories, startIndex, onClose, onPrevProfile, onNextProfile }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const handleNext = useCallback(() => {
    if (currentIndex >= stories.length - 1) {
      // If we're at the last story, close the viewer
      onClose();
      return;
    }
    setLoading(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    setLoading(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    if (stories.length === 0 || currentIndex >= stories.length) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories.length, handleNext]);

  if (!stories[currentIndex]) return null;

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    if (!touchStart.x && !touchStart.y) return;
    
    const currentTouch = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    
    const diff = {
      x: currentTouch.x - touchStart.x,
      y: currentTouch.y - touchStart.y
    };
    
    // Determine if the gesture is primarily horizontal or vertical
    const isHorizontalSwipe = Math.abs(diff.x) > Math.abs(diff.y);
    
    // Add resistance to the movement
    const resistance = 0.4;
    if (isHorizontalSwipe) {
      // Handle horizontal swipe
      setTranslate(prev => ({
        ...prev,
        x: diff.x * resistance
      }));
    } else {
      // Handle vertical swipe (only allow pulling down)
      if (diff.y < 0) return;
      setTranslate(prev => ({
        ...prev,
        y: diff.y * resistance
      }));
    }
  };

  const handleTouchEnd = () => {
    const threshold = {
      x: 100, // Threshold for horizontal swipe
      y: 150  // Threshold for vertical swipe (close gesture)
    };

    if (Math.abs(translate.x) > threshold.x) {
      // Horizontal swipe
      if (translate.x > 0) {
        onPrevProfile?.(); // Swipe right to previous profile
      } else {
        onNextProfile?.(); // Swipe left to next profile
      }
    } else if (translate.y > threshold.y) {
      // Vertical swipe down - close the story
      onClose();
    }

    // Reset position
    setTranslate({ x: 0, y: 0 });
    setTouchStart({ x: 0, y: 0 });
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
        style={{ 
          transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`,
          opacity: Math.max(1 - Math.abs(translate.y) / 400, 0.5) // Fade out when pulling down
        }}>
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
