import { LevelButtonProps } from "@/components/learn/LevelButton";
import Topic from "@/components/learn/Topic";
import { TopicHeaderProps } from "@/components/learn/TopicHeader";
import { Spinner } from "@/components/ui/spinner";
import React from "react";
type TopicProps = {
  topic: Omit<TopicHeaderProps, "index">;
  levels: (LevelButtonProps & { id: string })[];
}[];

export default function Learn() {
  const [topics, setTopics] = React.useState<TopicProps>([]);
  React.useEffect(() => {
    const sampleLevels: (LevelButtonProps & { id: string })[] = [];
const currentLevelIndex = 5; // Set the index of the current level
for (let i = 1; i <= 12; i++) {
  const levelType = i % 3 === 0 ? "quiz" : i % 2 === 0 ? "code" : "lesson";

  sampleLevels.push({
    id: `level_${i}`,
    isCurrent: i === currentLevelIndex,
    levelType,
    index: i,
    link: `/learn/courseName/level/${i}`,
    isUnlocked: i <= currentLevelIndex,
    mysteryLevel: false,
    isLast: i % 4 === 0,
    isCompleted: i < currentLevelIndex,
    progress: i === currentLevelIndex ? 50 : i <= currentLevelIndex ? 100 : 0,
    rank: i % 3 === 0 ? "Easy" : i % 2 === 0 ? "Advanced" : "Hard",
    xp: (i * 12 ) + 2
  });
};

const sampleTopics: TopicProps = [
  {
    topic: {
      name: "Introduction to Python",
      description: "a simple introduction to the python programming langauge.",
      isUnlocked: true,
    },
    levels: sampleLevels.slice(0, 4),
  },
  {
    topic: {
      name: "Variables",
      description: "what are variables and how are they used?",
      isUnlocked: true,
      xpNeeded: 150,
    },
    levels: sampleLevels.slice(4, 8),
  },
  {
    topic: {
      name: "Conditionals",
      description: "making the right logical choices",
      isUnlocked: false,
      xpNeeded: 350,
    },
    levels: sampleLevels.slice(8, 13),
  },
];
setTimeout(() => {
      setTopics(sampleTopics);
    }, 3000)
  }, []);
  console.log(topics);
  if (topics.length === 0) {
    return (
      <div className="relative h-screen">
        <Spinner
          variant="dots"
          withContainer
          containerBackground="transparent"
          containerType="center"
          size="sm"
        />
      </div>
    );
  }
  return (
    <div className="pb-5 lg:px-6 px-0 -mt-3">
      {topics.map((topic, index) => (
        <Topic
          topic={{ ...topic.topic, index }}
          levels={topic.levels}
          key={topic.topic.name + index}
        />
      ))}
    </div>
  );
}
