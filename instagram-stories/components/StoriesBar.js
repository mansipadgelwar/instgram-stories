import { useEffect, useState } from "react";
import Image from "next/image";

export default function StoriesBar({ onStorySelect,watched = [] }) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data));
  }, []);

  return (
    <div className="stories-bar">
      {stories.map((story) => (
        <div
          key={story.id}
         className={`story-thumbnail ${
            watched.includes(story.id) ? "watched" : "unwatched"
          }`}
          onClick={() => onStorySelect(story.id)}
        >
          <Image
            src={story.src}
            alt="story"
            width={62}
            height={62}
          />
        </div>
      ))}
    </div>
  );
}
