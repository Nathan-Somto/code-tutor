import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnAuthorizedError } from "../../errors/httpErrors";
import { prisma } from "../../config/db";
import { ResponseHandler } from "../../utils/responseHandler";
import {updateCourseProgress} from "../../data-access/courseProgress"
import {updateRankProgress} from "../../data-access/ranks"
import { updateStreaks } from "../../data-access/streaks";
import { checkIfBadgeUnlocked } from "../../data-access/badges";



const completeLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const { courseId, levelId} = req.body;
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
        xpPoints: true
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
    const {typeString, count, nextLevelId, nextTopicId} = await updateCourseProgress(studentId, courseId, levelId, levelProgress.level.levelType )
    // update rank progress, check if the user has achieved a new rank send info if so.
    const newRank = await updateRankProgress(student.rankProgress.id, levelProgress.level.levelType, student.rank, studentId)
    // update badge progress, check if user has claimed a new badge if so send info.
    const unlockedBadges = []
    let typeStringBadge
    if(typeString === 'quizCompletedCount'){
       typeStringBadge = await checkIfBadgeUnlocked('Quiz Master', count >= 10, studentId, Math.floor(count / 10))
    }
    else if(typeString === 'codeChallengeCompletedCount'){
       typeStringBadge =  await checkIfBadgeUnlocked('Code Ninja', count >= 10, studentId, Math.floor(count / 10) )
    }
    else if(typeString === 'lessonCompletedCount') {
       typeStringBadge = await checkIfBadgeUnlocked('Active Learner', count >= 10, studentId, Math.floor(count / 10))
    }
    if (typeStringBadge !== null && typeStringBadge !== undefined){
        unlockedBadges.push(typeStringBadge)
    }
   let xpChampBadge = await checkIfBadgeUnlocked('Xp Champ', student.xpPoints >= 500, studentId, Math.floor(student.xpPoints / 500))
    if(xpChampBadge !== null && xpChampBadge !== undefined){
        unlockedBadges.push(xpChampBadge)
    }
    ResponseHandler.send(res, 200, {
        totalXp: student.xpPoints,
        badges: unlockedBadges,
        nextLevelId,
        nextTopicId,
        studentId,
        rank : newRank ?? undefined,
        streaks
    }, 'successfully completed level', true)
  } catch (err) {
    next(err);
  }
};
export {completeLevel}