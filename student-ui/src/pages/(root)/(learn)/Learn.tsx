import { ErrorMessage } from "@/components/error-message";
import Topic from "@/components/learn/Topic";
import { Spinner } from "@/components/ui/spinner";
import { useLearn } from "@/providers/LearnProvider";
import React from "react";

export default function Learn() {
  const {
    curriculum,
    courseProgress,
    curriculumError,
    courseProgressError,
    isFetchingCoursePogress,
    isFetchingCurriculum,
    refetch
  } = useLearn();
  console.log(curriculum);
  console.log(courseProgress)
  const currentTopicIndex = React.useMemo(() => {
    if (!curriculum || !courseProgress) return null;
    return (
      curriculum.topics.findIndex(
        (topic) => topic.id === courseProgress.topicId
      )
    );
  }, [curriculum, courseProgress]);
console.log(currentTopicIndex);
console.log('current topic:',curriculum?.topics[currentTopicIndex ?? 0])
  const currentLevelIndex = React.useMemo(() => {
    if (currentTopicIndex === null || !curriculum || !courseProgress)
      return null;
    if(currentTopicIndex === -1) return -1;
    return (
      curriculum.topics[currentTopicIndex].Level.findIndex(
        (level) => level.id === courseProgress.levelId
      )
    );
  }, [currentTopicIndex, curriculum, courseProgress]);
  console.log("current level index:",currentLevelIndex);
  console.log('current topic levels:',curriculum?.topics[currentTopicIndex ?? 0]?.Level)
  const currentTopic = React.useMemo(() => {
    if (currentTopicIndex === null || !curriculum) return null;
    if(currentTopicIndex === -1) return null;
    return {
      totalXp: curriculum.topics[currentTopicIndex]?.totalXp,
      index: currentTopicIndex,
    };
  }, [currentTopicIndex, curriculum]);

  const currentLevel = React.useMemo(() => {
    if (currentLevelIndex === null || currentLevelIndex === -1) return null;
    return {
      index: currentLevelIndex,
      topicIndex: currentTopicIndex ?? 0,
      progress: courseProgress?.currentLevel?.progress ?? 0, // current level progress
    };
  }, [currentLevelIndex, currentTopicIndex, courseProgress]);
  console.log("current level:",currentLevel);
  if (curriculumError || courseProgressError) {
    return (
      <ErrorMessage refetch={refetch} />
    );
  }
  if (isFetchingCoursePogress || isFetchingCurriculum) {
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
      {curriculum !== null
        ? curriculum.topics.map((topic, index) => (
            <Topic
              currentLevel={currentLevel ?? { progress: 0, index: 0, topicIndex: 0 }}
              currentTopic={currentTopic ?? { totalXp: 0, index: 0 }}
              key={topic.id}
              levels={topic.Level}
              topic={{
                description: topic.description,
                id: topic.id,
                name: topic.name,
                totalXp: topic.totalXp,
                index: index,
              }}
            />
          ))
        : null}
    </div>
  );
}
