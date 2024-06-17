import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
} from "../../errors/httpErrors";
import { prisma } from "../../config/db";
import { ResponseHandler } from "../../utils/responseHandler";
import { updateCourseProgress } from "../../data-access/courseProgress";
import { updateRankProgress } from "../../data-access/ranks";
import { getStreaksData, updateStreaks } from "../../data-access/streaks";
import { checkIfBadgeUnlocked } from "../../data-access/badges";
import { getDayDifference } from "../../utils/getDayDifference";
import { checkIfOwner } from "../../utils/checkIfOwner";
import { zodValidator } from "../../utils/zodValidator";
import { codeSolutionSchema } from "./student.schema";

const freezeStreaks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    if (studentId !== req.user?.profileId) {
      throw new UnAuthorizedError("cannot freeze streaks of another user!");
    }
    // check if the user's xp point is sufficient
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        gems: true,
        streaks: true,
      },
    });
    if (!student) {
      throw new BadRequestError("student profile does not exist!");
    }
    if (student.gems < 20) {
      throw new BadRequestError("insufficient gems balance!");
    }
    if (student.streaks === null) {
      throw new BadRequestError("student does not have an active streak!");
    }
    const today = new Date();
    if (getDayDifference(today, student.streaks.currentDate) === 0) {
      await prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          gems: {
            decrement: 20,
          },
        },
      });
      const historyCopy = student.streaks.history;
      const yesterdayIndex = historyCopy.length - 2;
      let yesterday = historyCopy[yesterdayIndex] ?? undefined;
      if (yesterday !== undefined && yesterday === 0) {
        // set yesterday to 2
        yesterday = 2;

        let previousCount = 0;
        for (let i = yesterdayIndex - 1; i > 0; i--) {
          if (historyCopy[i] === 0) {
            break;
          }
          previousCount++;
        }
        let updatedCount = previousCount + 1 + student.streaks.currentCount;
        historyCopy[yesterdayIndex] = yesterday;
        const streaks = await prisma.streaks.update({
          where: {
            id: student.streaks.id,
          },
          data: {
            currentCount: updatedCount,
            history: historyCopy,
          },
        });
        ResponseHandler.send(
          res,
          201,
          {
            streaks: {
              currentCount: updatedCount,
              currentStatus: streaks.currentStatus,
              currentDate: streaks.currentDate,
              history: streaks.history.slice(-7),
            },
            gems: student.gems - 20,
            studentId,
          },
          "succesfully froze streak",
          true
        );
      } else {
        throw new BadRequestError(
          `freeze streak cannot be applied because ${
            yesterday === 1
              ? "you achieved a streak"
              : "you have used a freeze streak"
          }`
        );
      }
    } else {
      throw new BadRequestError(
        "freeze streak is only applicable for a missed streak that occured yesterday!"
      );
    }
  } catch (err) {
    next(err);
  }
};
const completeLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const { courseId, levelId } = req.body;
    const profileId = req.user?.profileId;
    if (studentId !== profileId) {
      throw new UnAuthorizedError("cannot complete a level for another user");
    }
    // check if user has enrolled in the course.
    const course = await prisma.course.findFirst({
      where: {
        enrolledStudentsId: {
          has: studentId,
        },
      },
      select: {
        id: true,
      },
    });
    if (!course) {
      throw new UnAuthorizedError("student not enrolled in course!");
    }
    // if student has already completed the level no need to perform calculations and updates,
    const levelProgress = await prisma.levelProgress.findFirst({
      where: {
        AND: [{ studentId }, { levelId }],
      },
      select: {
        completedLevel: true,
        level: {
          select: {
            difficulty: true,
            xp: true,
            levelType: true,
          },
        },
      },
    });
    if (!levelProgress) {
      throw new BadRequestError("level progress has not been created!");
    }
    let xpGained = 0;
    if (levelProgress.completedLevel) {
      // just reduce the xp of the level by 80% and add to total xp and send the result.
      xpGained = levelProgress.level.xp * 0.2;
      const student = await prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          xpPoints: {
            increment: xpGained,
          },
        },
      });
      ResponseHandler.send(
        res,
        200,
        {
          result: {
            xpGained,
          },
          totalXp: student.xpPoints,
        },
        "added reward for already completed level"
      );
      return;
    }
    // for first time completion. update xp
    xpGained = levelProgress.level.xp;
    const student = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        xpPoints: {
          increment: xpGained,
        },
      },
      select: {
        rank: true,
        rankProgress: {
          select: {
            id: true,
          },
        },
        levelProgress: {
          select: {
            id: true,
          },
        },
        xpPoints: true,
      },
    });
    const levelProgressId = student.levelProgress.find((id) => id === levelId);
    if (!levelProgressId) {
      throw new BadRequestError("");
    }
    // Update level progress.
    await prisma.levelProgress.update({
      where: { id: levelProgressId.id },
      data: { completedLevel: true },
    });
    // Update streaks if this is their first lesson of the day
    const streaks = await updateStreaks(studentId);
    // Update course progress.
    const { typeString, count, nextLevelId, nextTopicId } =
      await updateCourseProgress(
        studentId,
        courseId,
        levelId,
        levelProgress.level.levelType
      );
    // update rank progress, check if the user has achieved a new rank send info if so.
    const newRank = await updateRankProgress(
      student.rankProgress.id,
      levelProgress.level.levelType,
      student.rank,
      studentId
    );
    // update badge progress, check if user has claimed a new badge if so send info.
    const unlockedBadges = [];
    let typeStringBadge;
    if (typeString === "quizCompletedCount") {
      typeStringBadge = await checkIfBadgeUnlocked(
        "Quiz Master",
        count >= 10,
        studentId,
        Math.floor(count / 10)
      );
    } else if (typeString === "codeChallengeCompletedCount") {
      typeStringBadge = await checkIfBadgeUnlocked(
        "Code Ninja",
        count >= 10,
        studentId,
        Math.floor(count / 10)
      );
    } else if (typeString === "lessonCompletedCount") {
      typeStringBadge = await checkIfBadgeUnlocked(
        "Active Learner",
        count >= 10,
        studentId,
        Math.floor(count / 10)
      );
    }
    if (typeStringBadge !== null && typeStringBadge !== undefined) {
      unlockedBadges.push(typeStringBadge);
    }
    let xpChampBadge = await checkIfBadgeUnlocked(
      "Xp Champ",
      student.xpPoints >= 500,
      studentId,
      Math.floor(student.xpPoints / 500)
    );
    if (xpChampBadge !== null && xpChampBadge !== undefined) {
      unlockedBadges.push(xpChampBadge);
    }
    ResponseHandler.send(
      res,
      200,
      {
        totalXp: student.xpPoints,
        badges: unlockedBadges,
        nextLevelId,
        nextTopicId,
        studentId,
        rank: newRank ?? undefined,
        streaks,
      },
      "successfully completed level",
      true
    );
  } catch (err) {
    next(err);
  }
};
const getStreaks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = checkIfOwner(
      req,
      "cannot access streaks of another student!"
    );
    const streaksData = getStreaksData(studentId);
    ResponseHandler.send(
      res,
      200,
      streaksData,
      "successfully retrieved streaks data for student"
    );
  } catch (err) {
    next(err);
  }
};
const enrollInCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if it is the logged in Student
    const { studentId } = req.params;
    const profileId = req.user?.profileId;
    const { courseId } = req.body;
    if (studentId !== profileId) {
      throw new UnAuthorizedError("cannot enroll another user in a course!");
    }
    if (typeof courseId !== "string") {
      throw new BadRequestError("courseId must be of type string");
    }
    // check if the user is already enrolled!
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        enrolledStudents: {
          some: {
            id: studentId,
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundError("Course could not be found!");
    }
    const firstTopic = await prisma.topic.findFirst({
      where: { courseId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        Level: { orderBy: { order: "asc" }, select: { id: true }, take: 1 },
      },
    });

    if (!firstTopic || !firstTopic.Level.length) {
      throw new NotFoundError("The course does not have any topics or levels!");
    }

    const firstLevelId = firstTopic.Level[0].id;
    const firstTopicId = firstTopic.id;

    const courseProgress = await prisma.courseProgress.create({
      data: {
        courseId,
        topicId: firstLevelId,
        levelId: firstTopicId,
        isCompleted: false,
        studentId,
      },
    });
    await prisma.course.update({
      where: { id: courseId },
      data: {
        CourseProgress: { connect: { id: courseProgress.id } },
        enrolledStudents: { connect: { id: studentId } },
      },
    });

    await prisma.student.update({
      where: { id: studentId },
      data: { courseProgress: { connect: { id: courseProgress.id } } },
    });

    ResponseHandler.send(res, 201, {
      enrolledIds: course.enrolledStudentsId,
      courseProgress,
      studentId,
      message: "Enrolled in course successfully",
    });
  } catch (err) {
    next(err);
  }
};
const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const profileId = req.user?.profileId;

    if (studentId !== profileId) {
      throw new UnAuthorizedError("Cannot access courses of another user!");
    }

    // Fetch all courses with their topic IDs
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        language: true,
        Topic: {
          select: {
            id: true,
          },
        },
      },
    });

    // Fetch the student's enrolled course IDs and progress
    const studentData = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        enrolledCourses: {
          select: {
            id: true,
          },
        },
        courseProgress: {
          select: {
            courseId: true,
            topicId: true,
          },
        },
      },
    });

    if (!studentData) {
      throw new BadRequestError(
        "Student not found or not enrolled in any courses"
      );
    }

    const enrolledCourseIds = studentData.enrolledCourses.map(
      (course) => course.id
    );
    const progressMap = new Map(
      studentData.courseProgress.map((progress) => [
        progress.courseId,
        progress.topicId,
      ])
    );

    // Combine all data
    const result = allCourses.map((course) => {
      const isEnrolled = enrolledCourseIds.includes(course.id);
      const topics = course.Topic.map((topic) => topic.id);
      const currentTopic = progressMap.get(course.id);
      const topicIndex =
        currentTopic !== undefined ? (topics.findIndex((value) => value === currentTopic) ?? 0) : 0;
      const progress = isEnrolled
        ? Math.floor(topicIndex / topics.length) * 100
        : undefined;
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        imageSrc: course.image_url,
        language: course.language,
        isEnrolled,
        progress,
      };
    });
    ResponseHandler.send(
      res,
      200,
      { courses: result, studentId },
      "successfully retrieved courses for srudent"
    );
  } catch (err) {
    next(err);
  }
};
const getBadgeProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = checkIfOwner(
      req,
      "cannot access badge progress of another student!"
    );
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
      select: {
        quizCompletedCount: true,
        codeChallengeCompletedCount: true,
        lessonCompletedCount: true,
        xpPoints: true,
      },
    });
    if (!student) {
      throw new BadRequestError("student does not exist!");
    }
    const badges = await prisma.badgeProgress.findMany({
      where: {
        studentId,
      },
      select: {
        achieved: true,
        Badge: {
          select: {
            description: true,
            achievementCount: true,
            image: true,
            name: true,
            badgeType: true,
          },
        },
      },
      take: 4,
    });
    const badgeProgress = badges.map((badge) => {
      const badgeType = badge.Badge.badgeType;
      const count =
        badgeType === "Quiz"
          ? student.quizCompletedCount
          : badgeType === "Learner"
          ? student.lessonCompletedCount
          : badgeType === "Code"
          ? student.codeChallengeCompletedCount
          : student.xpPoints;
      const progress = badge.achieved
        ? undefined
        : Math.floor(count / badge.Badge.achievementCount) * 100;
      return {
        progress,
        ...badge,
      };
    });
    ResponseHandler.send(
      res,
      200,
      {
        badgeProgress,
        studentId,
      },
      "successfully retrieved badge progress"
    );
  } catch (err) {
    next(err);
  }
};
const getStudentProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = checkIfOwner(
      req,
      "cannot access the progress of another student!"
    );
    const progressData = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        gems: true,
        rank: true,
        xpPoints: true,
      },
    });
    if (!progressData) {
      throw new BadRequestError("student does not exist!");
    }
    const streaksData = getStreaksData(studentId);
    ResponseHandler.send(
      res,
      200,
      {
        progressData: {
          ...progressData,
          streaksData,
        },
        studentId,
      },
      "successfully retireved student progress data"
    );
  } catch (err) {
    next(err);
  }
};
const getCourseProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = checkIfOwner(
      req,
      "cannot access the course progress of another student!"
    );
    const { courseId } = req.params;
    const courseProgress = await prisma.courseProgress.findFirst({
      where: {
        AND: [{ studentId }, { courseId }],
      },
      select: {
        levelId: true,
        topicId: true,
        isCompleted: true,
      },
    });
    ResponseHandler.send(
      res,
      200,
      { courseProgress, studentId },
      "succesfully retireved course progress"
    );
  } catch (err) {
    next(err);
  }
};
const getLevelProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = checkIfOwner(
      req,
      "cannot access the level progress of another student!"
    );
    const { levelId } = req.params;
    const levelProgress = await prisma.levelProgress.findFirst({
      where: {
        AND: [{ studentId }, { levelId }],
      },
      select: {
       completedLevel: true,
       currentLessonNumber: true,
       currentQuizNumber: true
      },
    });
    ResponseHandler.send(
      res,
      200,
      { levelProgress, studentId },
      "succesfully retireved level progress"
    );
  } catch (err) {
    next(err);
  }
};
const saveCodeSolution = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = checkIfOwner(
      req,
      "cannot save code for another student!"
    );

    const { answer, codeChallengeId, courseId, levelId } = zodValidator(
      codeSolutionSchema,
      req.body
    );
    const levelProgress = await prisma.levelProgress.findFirst({
      where: {
        levelId,
        studentId
      }
    });
    if(!levelProgress){
      throw new UnAuthorizedError("student has not unlocked level!")
    }
   const codeChallenge =  await prisma.codeChallenge.findFirst({
      where: {
        id: codeChallengeId
      }
    });
    if (!codeChallenge) {
      throw new BadRequestError("code challenge does not exist!");
    }
    const savedSolution = await prisma.solution.create({
       data: {
       studentId,
       codeChallengeId,
       answer,
       courseId
       }
    });
    await prisma.codeChallenge.update({
      where: {
        id: codeChallengeId
      },
      data: {
        solution : {
          connect : {
            id: savedSolution.id
          }
        }
      }
    });
    await prisma.student.update({
      where: {
        id: studentId
      },
      data: {
        solutions : {
          connect : {
            id: savedSolution.id
          }
        }
      }
    });
    ResponseHandler.send(res, 201, {
      answer,
      solutionId: savedSolution.id,
      codeChallengeId,
      levelId
    })
  } catch (err) {
    next(err);
  }
};
const getLeaderboard = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { pageSize = '10', page = '1' } = req.query;

    // Convert query parameters to integers
    let size = parseInt(pageSize as string, 10);
    let currentPage = parseInt(page as string, 10);

    if (isNaN(size) || isNaN(currentPage)) {
      throw new BadRequestError("Invalid page or pageSize query parameter");
    } else {
      size = Math.abs(size);
      currentPage = Math.abs(currentPage);
    }

    // Calculate the offset for pagination
    const offset = (currentPage - 1) * size;

    // Get the total count of students for pagination
    const totalStudents = await prisma.student.count();
    const totalPages = Math.ceil(totalStudents / size)
   // get the page size equivalent of students ordered by increasing xp points
  const leaderboard =  await prisma.student.findMany({
    orderBy: {
      xpPoints : 'desc'
    },
    take: size,
    skip: offset,
    select: {
      username: true,
      id: true,
      xpPoints: true,
      rank: true,
      user: {
        select : {
          name: true,
          profile_photo: true
        }
      }
    }
   });
    const leaderboardWithPosition =  leaderboard.map((student, index) =>{
      const position = (index + 1 ) + offset; 
      return {
        ...student,
        position
      }
    });
    const response = {
      totalStudents,
      pageSize: size,
      currentPage,
      leaderboard: leaderboardWithPosition
    }
    ResponseHandler.send(res, 200, response, 'successfully retireved leaderboard data')
  }
  catch(err){
    next(err)
  }
}
const getLeaderboardPosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    // Fetch the student's XP points and other details by their username
    const student = await prisma.student.findUnique({
      where: { username },
      select: {
        xpPoints: true,
        username: true,
        id: true,
      },
    });

    if (!student) {
      throw new NotFoundError("Student not found!");
    }

    // Count the number of students with higher XP points than the given student
    const higherRankedStudentsCount = await prisma.student.count({
      where: {
        xpPoints: {
          gt: student.xpPoints,
        },
      },
    });

    // Calculate the student's position
    const position = higherRankedStudentsCount + 1;


    // Determine the start position as a multiple of the page size
    const pageSize = 10;
    const startPosition = Math.floor((position - 1) / pageSize) * pageSize + 1;
    const endPosition = startPosition + pageSize - 1;

    // Fetch the students using the determined range
    const surroundingStudents = await prisma.student.findMany({
      orderBy: {
        xpPoints: 'desc',
      },
      skip: startPosition - 1, // Skip the students before the start position
      take: endPosition,
      select: {
        username: true,
        id: true,
        xpPoints: true,
        rank: true,
        user: {
          select: {
            name: true,
            profile_photo: true,
          },
        },
      },
    });
    const totalStudents = await prisma.student.count();
    const totalPages = Math.ceil(totalStudents / pageSize);
    const currentPage = Math.floor(endPosition / pageSize);
    // Map the surrounding students to include their positions
    const leaderboardWithPosition = surroundingStudents.map((student, index) => {
      const studentPosition = startPosition + index;
      return {
        ...student,
        position: studentPosition,
        isUser: student.username === username,
      };
    });
    const response = {
      leaderboard: leaderboardWithPosition,
      totalPages,
      pageSize,
      currentPage
    }
    ResponseHandler.send(res, 200, response, 'Successfully retrieved student leaderboard position');
  } catch (err) {
    next(err);
  }
};



const getProfile = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const {studentId} = req.params;
  const profile =   await prisma.student.findFirst({
      where : {
      id: studentId
    }, select: {
      streaks: {
        select: {
          currentCount: true
        }
      },
      gems: true,
      rank: true,
      unlockedBadges: {
        select: {
          name: true,
          id: true,
          image: true,
          description: true
        }
      },
      badgeProgress : {
        select : {
          xTimes: true,
          achievementDate: true,
          badgeId: true
        }
      },
      username: true,
      xpPoints: true,
      user: {
        select: {
          joinedAt: true,
          name: true,
          profile_photo: true
        }
      }
    }});
    ResponseHandler.send(res, 200, {profile, studentId}, "retrieved student profile");
  }
  catch(err){
    next(err);
  }
}

export {
  completeLevel,
  freezeStreaks,
  enrollInCourse,
  getCourses,
  getBadgeProgress,
  getStudentProgress,
  getStreaks,
  getCourseProgress,
  saveCodeSolution,
  getLeaderboard,
  getLevelProgress,
  getProfile,
  getLeaderboardPosition
};
