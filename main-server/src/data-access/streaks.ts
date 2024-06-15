import {prisma} from "../config/db"
import { getDayDifference } from "../utils/getDayDifference";
export const updateStreaks = async (studentId: string) => {
  const today = new Date();
  const streak = await prisma.streaks.findFirst({
    where: {
      studentId,
    },
  });
  let streaks;
  if (streak) {
    const dayDifference = getDayDifference(today, streak.currentDate);

    // The streak is already updated for today
    if (dayDifference === 0) {
      return streaks;
    }

    let updatedHistory = [...streak.history];
    let updatedCount = streak.currentCount;

    // If the streak is for consecutive day
    if (dayDifference === 1) {
      updatedHistory.push(1);
      updatedCount++;
    } else {
      // If days are missed, pad with 0s and reset count
      for (let i = 0; i < dayDifference - 1; i++) {
        updatedHistory.push(0);
      }
      updatedHistory.push(1);
      updatedCount = 1;
    }

    // Ensure history length does not exceed 7 days
    if (updatedHistory.length > 7) {
      updatedHistory = updatedHistory.slice(updatedHistory.length - 7);
    }

   const updatedStreaks = await prisma.streaks.update({
      where: { id: streak.id },
      data: {
        currentDate: today,
        currentCount: updatedCount,
        history: updatedHistory,
      },
    });
    streaks = {
        currentCount: updatedStreaks.currentCount,
        currentDate: updatedStreaks.currentDate,
        history: updatedStreaks.history
    }
    return streaks;
  } 
    // No existing streak, create a new one
    await prisma.streaks.create({
      data: {
        studentId,
        currentDate: today,
        currentCount: 1,
        history: [1],
      },
    });
  streaks = {
    currentCount: 1,
    currentDate: today,
    history: [1]
  };
  return streaks;
};
