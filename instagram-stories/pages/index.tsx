import { useState, useEffect, SetStateAction } from "react";
import StoriesBar from "../components/StoriesBar";
import StoryViewer from "../components/StoryViewer";

type Story = {
  id: string | number;
  // add other properties as needed
};

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<string | number | null>(null);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data));
  }, []);

  return (
    <div>
      <StoriesBar onStorySelect={(id: string | number | null) => setSelectedStory(id)} />
      {selectedStory !== null && (
        <StoryViewer
          stories={stories}
          startIndex={stories.findIndex((s) => s.id === selectedStory)}
          onClose={() => setSelectedStory(null)} onPrevProfile={undefined} onNextProfile={undefined}        />
      )}
    </div>
  );
}
