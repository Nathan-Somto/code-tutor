import { $Enums } from "@prisma/client";
import { prisma } from "../config/db";
import { BadRequestError } from "../errors/httpErrors";
const getNextTopicAndLevelId = async (levelId: string, courseId: string) => {
  // given a levelId return the next levelId
  // topics have an array of levelIds, find the index of the current levelId and return the next levelId
  // but the levelId might be the last in the topic if so find the next topic in the course and return the first levelId
  const level = await prisma.level.findUnique({
    where: {
      id: levelId,
    },
    select: {
      topicId: true,
    },
  });
  if (!level) {
    throw new BadRequestError("level not found");
  }
  // levels have an order field, sort by order and return the next levelId
  const levels = await prisma.level.findMany({
    where: {
      topicId: level.topicId,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
    },
  });
  if (!levels) {
    throw new BadRequestError("levels not found");
  }
  const currentLevelIndex = levels.findIndex((level) => level.id === levelId);
  if (currentLevelIndex === levels.length - 1) {
    // find the next topic in the course and return the first levelId
    const courseTopics = await prisma.topic.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
      },
    });
    if (!courseTopics || courseTopics.length === 0) {
      throw new BadRequestError("No topics found in the course");
    }

    // Find the index of the current topic
    const currentTopicIndex = courseTopics.findIndex(
      (topic) => topic.id === level.topicId
    );

    if (currentTopicIndex === -1) {
      throw new BadRequestError("Current topic not found in the course");
    }

    // If the current topic is the last in the course, return null indicating no more levels
    if (currentTopicIndex === courseTopics.length - 1) {
      return null;
    }

    // Otherwise, return the first level ID of the next topic
    const nextTopicId = courseTopics[currentTopicIndex + 1].id;
    const nextTopicLevels = await prisma.topic.findFirst({
      where: {
        id: nextTopicId,
      },
      select: {
        id: true,
        Level: {
          select: {
            id: true,
          },
          take: 1
        },
      },
    });
    // If the next topic has no levels, return null indicating no more levels
    if (!nextTopicLevels || nextTopicLevels.Level.length === 0) {
      return null;
    }

    return {
      nextLevelId: nextTopicLevels.Level[0].id,
      nextTopicId: nextTopicLevels.id,
    };
  }
  return {
    nextLevelId: levels[currentLevelIndex + 1].id,
    nextTopicId: level.topicId,
  };
};
type TypeString =
  | "quizCompletedCount"
  | "lessonCompletedCount"
  | "codeChallengeCompletedCount";
export const updateCourseProgress = async (
  studentId: string,
  courseId: string,
  levelId: string,
  levelType: $Enums.LevelType
) => {
  const courseProgress = await prisma.courseProgress.findFirst({
    where: {
      AND: [{ studentId }, { courseId }],
    },
  });
  if (courseProgress && courseProgress.levelId === levelId) {
    const values = await getNextTopicAndLevelId(levelId, courseId);
    console.log("values from  getNextTopicAndLevelId", JSON.stringify(values));
    // update the count of the challenge if it is the appropriate level type
    const typeString: TypeString =
      levelType === "Quiz"
        ? "quizCompletedCount"
        : levelType === "Lesson"
        ? "lessonCompletedCount"
        : "codeChallengeCompletedCount";
    const countUpdate = { [typeString]: { increment: 1 } };
    const currentProgress = await prisma.courseProgress.update({
      where: { id: courseProgress.id },
      data: {
        levelId: values?.nextLevelId ?? levelId,
        topicId: values?.nextTopicId ?? courseProgress.topicId,
        isCompleted: values === null
      },
    });
   const student = await prisma.student.update({
      where: {
        id: studentId
      },
      data : {
        ...countUpdate,
      }
    })
    if (values?.nextLevelId) {
   const levelProgress =   await prisma.levelProgress.create({
        data: {
          studentId,
          levelId: values.nextLevelId,
         completedLevel: false,
         currentLessonNumber: 0,
         currentQuizNumber: 0,
        },
      });
      await prisma.student.update({
        where : {
          id:studentId
        },
        data : {
          levelProgress : {
            connect: {
              id: levelProgress.id
            }
          }
        }
      })
    }
    return {
      count: student[typeString],
      typeString,
      nextLevelId: values?.nextLevelId,
      nextTopicId: values?.nextTopicId,
    };
  }
  throw new BadRequestError("not the current level in course");
};
