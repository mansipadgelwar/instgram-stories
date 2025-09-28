import { useState, useEffect, SetStateAction } from "react";
import StoriesBar from "../components/StoriesBar";
import StoryViewer from "../components/StoryViewer";

type Story = {
  id: string | number;
  // add other properties as needed
};

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
 // selectedStory can be number or null
const [selectedStory, setSelectedStory] = useState<number | null>(null);

// watched is always an array of numbers
const [watched, setWatched] = useState<number[]>([]);

const handleStorySelect = (id: number) => {
  setSelectedStory(id);

  setWatched((prev) => 
    prev.includes(id) ? prev : [...prev, id]
  );
};



  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data));
  }, []);

  return (
    <div>
      <StoriesBar onStorySelect={handleStorySelect} watched={watched}/>
      {selectedStory !== null && (
        <StoryViewer
          stories={stories}
          startIndex={stories.findIndex((s) => s.id === selectedStory)}
          onClose={() => setSelectedStory(null)} onPrevProfile={undefined} onNextProfile={undefined}        />
      )}
    </div>
  );
}
