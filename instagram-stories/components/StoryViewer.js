import { useEffect, useState } from "react";

export default function StoryViewer({ stories, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stories.length === 0) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setLoading(true);
    setCurrentIndex((prev) =>
      prev < stories.length - 1 ? prev + 1 : prev
    );
  };

  if (!stories[currentIndex]) return null;

  return (
    <div className="story-viewer">
      <button className="close-btn" onClick={onClose} aria-label="Close story">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="story-container">
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
