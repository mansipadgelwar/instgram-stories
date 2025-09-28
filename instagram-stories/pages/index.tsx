import { useState, useEffect } from "react";
import StoriesBar from "../components/StoriesBar";
import StoryViewer from "../components/StoryViewer";

type Story = {
  id: number; // force number
  src: string;
};
export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [watched, setWatched] = useState<number[]>([]);

 const handleStorySelect = (id: string | number) => {
  // If you only want numbers in watched, convert to number (optional)
  const numericId = typeof id === "number" ? id : parseInt(id, 10);

  setSelectedStory(numericId);

  setWatched((prev) =>
    prev.includes(numericId) ? prev : [...prev, numericId]
  );
};

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data: Story[]) => setStories(data));
  }, []);

  const startIndex = selectedStory !== null 
    ? stories.findIndex((s) => s.id === selectedStory) 
    : -1;

  return (
    <div>
      <StoriesBar onStorySelect={handleStorySelect} watched={watched} />
      {selectedStory !== null && startIndex !== -1 && (
        <StoryViewer
          stories={stories}
          startIndex={startIndex}
          onClose={() => setSelectedStory(null)}
          onPrevProfile={() => {}}
          onNextProfile={() => {}}
        />
      )}
    </div>
  );
}
