import { Curriculum } from "@/types";
import LevelButton  from "./LevelButton";
import TopicHeader from "./TopicHeader";
import { useRoot } from "@/providers/RootProvider";

export type TopicProps = {
  topic: Omit<Curriculum["topics"][number], "Level"> & { index: number };
  currentTopic: {
    totalXp: number;
    index: number;
  };
  currentLevel: {
    index: number;
    topicIndex: number;
    progress: number;
  };
  levels: (Curriculum["topics"][number]["Level"][number] & { id: string })[];
};
export default function Topic({
  topic,
  levels,
  currentLevel,
  currentTopic,
}: TopicProps) {
  //const currentCourse = { id: "1234567" };
  const {data: {currentCourse}} = useRoot();
  return (
    <div>
      <TopicHeader
        description={topic.description}
        index={topic.index}
        isUnlocked={topic.index <= currentTopic.index}
        name={topic.name}
        totalXp={topic.index > currentTopic.index ? topic.totalXp : undefined}
      />
      <div className="relative my-3  flex w-full flex-col items-center justify-center">
        {levels.map((level, index) => {
          let isCurrent = currentLevel.index === index &&
          currentLevel.topicIndex === topic.index;
        let isUnlocked = currentLevel.topicIndex >= topic.index &&
        currentLevel.index >= index;
         return ( <LevelButton
            isCompleted={
              currentLevel.index > index ||
              currentLevel.topicIndex > topic.index
            }
            levelType={level.levelType}
            name={level.name}
            isCurrent={
              isCurrent
            }
            isLast={index === levels.length - 1}
            mysteryLevel={level.mysteryLevel}
            rank={level.difficulty}
            isUnlocked={
             isUnlocked
            }
            xp={level.xp}
            link={`/challenge/${currentCourse?.id}/level/${level.id}/${level.levelType}`}
            index={index}
            key={level.id}
            progress={(isCurrent) ? currentLevel?.progress: isUnlocked ? 100 : undefined}
          />)
          })}
      </div>
    </div>
  );
}
