import { useEffect, useState } from "react";

export default function StoriesBar({ onStorySelect }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data));
  }, []);

  return (
    <div className="stories-bar">
      {stories.map((story) => (
        <img
          key={story.id}
          src={story.src}
          alt="story"
          className="story-thumbnail"
          onClick={() => onStorySelect(story.id)}
        />
      ))}
    </div>
  );
}
