import { useEffect, useState, useCallback } from "react";

type Story = {
  id: string | number;
  src: string;
  // add other properties if needed
};

type StoryViewerProps = {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  onPrevProfile?: () => void;
  onNextProfile?: () => void;
};

export default function StoryViewer({
  stories,
  startIndex,
  onClose,
  onPrevProfile,
  onNextProfile
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const handleNext = useCallback(() => {
    if (currentIndex >= stories.length - 1) {
      onClose();
      return;
    }
    setLoading(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) {
      onPrevProfile?.();
      return;
    }
    setLoading(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex, onPrevProfile]);

  useEffect(() => {
    if (stories.length === 0 || currentIndex >= stories.length) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories.length, handleNext]);

  if (!stories[currentIndex]) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.x && !touchStart.y) return;

    const currentTouch = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    const diff = {
      x: currentTouch.x - touchStart.x,
      y: currentTouch.y - touchStart.y
    };

    const isHorizontalSwipe = Math.abs(diff.x) > Math.abs(diff.y);
    const resistance = 0.4;

    if (isHorizontalSwipe) {
      setTranslate((prev) => ({ ...prev, x: diff.x * resistance }));
    } else {
      if (diff.y < 0) return;
      setTranslate((prev) => ({ ...prev, y: diff.y * resistance }));
    }
  };

  const handleTouchEnd = () => {
    const threshold = { x: 100, y: 150 };

    if (Math.abs(translate.x) > threshold.x) {
      translate.x > 0 ? onPrevProfile?.() : onNextProfile?.();
    } else if (translate.y > threshold.y) {
      onClose();
    }

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
          opacity: Math.max(1 - Math.abs(translate.y) / 400, 0.5)
        }}
      >
        {loading && <div className="loader"></div>}
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
