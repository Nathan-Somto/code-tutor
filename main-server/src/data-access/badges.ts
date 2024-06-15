import {prisma} from "../config/db"
export const checkIfBadgeUnlocked = async (
    name: string,
    criteria: boolean,
    studentId: string,
    xTimes: number
  ) => {
    // if they pass the criteria
    if (criteria) {
      const badge = await prisma.badge.findUnique({
        where: {
          name,
        },
      });
      if (!badge) {
        return null;
      }
      // update students unlocked badges
      const student = await prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          // add the new badge to unlocked badges
          unlockedBadges: {
            connect: {
              id: badge.id,
            },
          },
        },
      });
      if (!student) {
        return null;
      }
  
      // update achievement date and xTimes in badge progress
      const badgeProgress = await prisma.badgeProgress.findFirst({
        where: {
          AND: [
            { studentId },
            { badgeId: badge.id }
          ]
        }
      })
      if (!badgeProgress) {
        throw new Error('Badge progress not found');
      }
      await prisma.badgeProgress.update({
        where: {
          id: badgeProgress.id
        },
        data: {
          achieved: true,
          achievementDate: new Date(),
          xTimes,
        },
      });
      // return badge
      return {
        badge: {
          name: badge.name,
          description: badge.description,
          image: badge.image,
        },
        xTimes,
      };
    }
  };