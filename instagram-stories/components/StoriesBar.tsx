import { useEffect, useState } from "react";
import Image from "next/image";

type Story = {
  id: string | number;
  src: string;
  // add other properties if needed
};

type StoriesBarProps = {
  onStorySelect: (id: string | number) => void;
  watched?: (string | number)[];
};

export default function StoriesBar({ onStorySelect, watched = [] }: StoriesBarProps) {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data: Story[]) => setStories(data));
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
