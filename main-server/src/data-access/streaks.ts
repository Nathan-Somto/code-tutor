import {prisma} from "../config/db"
import { BadRequestError } from "../errors/httpErrors";
import { getDayDifference } from "../utils/getDayDifference";
export const updateStreaks = async (studentId: string) => {
  const today = new Date();
  // gets the streaks data for the student
  const streak = await prisma.streaks.findFirst({
    where: {
      studentId,
    },
  });
  let streaks;
  if (streak) {
    const dayDifference = getDayDifference(today, streak.currentDate);

    // The streak is already updated for today
    if (dayDifference === 0 && streak.currentStatus === 1) {
      return streaks;
    }

    let updatedHistory = [...streak.history];
    let updatedCount = streak.currentCount;
    let createdDate = streak.createdDate;
    let currentStatus = streak.currentStatus;
    // If the streak is for consecutive day
    if (dayDifference === 1) {
      currentStatus = 1;
      updatedHistory.push(1);
      updatedCount+=1;
    } else {
      // If days are missed, the historry length is less than the difference between today and the streak start date
      const diffFromCreatedDate = getDayDifference(createdDate, today);
      if (diffFromCreatedDate > updatedHistory.length) {
        const missingDays = diffFromCreatedDate - updatedHistory.length;
        for (let i = 0; i < missingDays; i++) {
          updatedHistory.push(0);
        }
        updatedHistory.push(1);
        updatedCount = 1;
        currentStatus = 1;
      }
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
        currentStatus: 1,
        history: updatedStreaks.history.slice(-7)
    }
    return streaks;
  } 
    // No existing streak, create a new one
    await prisma.streaks.create({
      data: {
        studentId,
        currentDate: today,
        currentCount: 1,
        currentStatus: 1,
        history: [1],
      },
    });
  streaks = {
    currentCount: 1,
    currentDate: today,
    currentStatus: 1,
    history: [1]
  };
  return streaks;
};


export const getStreaksData = async (studentId: string) => {
  const streak = await prisma.streaks.findFirst({
    where: {
      studentId
    }
  });

  if (!streak) {
    return {
      history: [],
      currentStatus: 0,
      currentDate: new Date(),
      currentCount: 0
    };
  }

  const today = new Date();
  const currentDate = streak.currentDate;
  const createdDate = streak.createdDate;
  const diffFromCurrentDate = getDayDifference(currentDate, today);
  const diffFromCreatedDate = getDayDifference(createdDate, today);

  // If current date is today, send back the current data.
  if (diffFromCurrentDate === 0) {
    return {
      history: streak.history.slice(-7),
      currentStatus: streak.currentStatus,
      currentDate,
      currentCount: streak.currentCount
    };
  } else {
    // Ensure the length of the history matches the actual days passed since createdDate
    const updatedHistory = [...streak.history];

    if (diffFromCreatedDate > updatedHistory.length) {
      const missingDays = diffFromCreatedDate - updatedHistory.length;

      for (let i = 0; i < missingDays; i++) {
        updatedHistory.push(0);
      }
    }

    await prisma.streaks.update({
      where: {
        id: streak.id
      },
      data: {
        currentCount: 0,
        currentDate: today,
        history: updatedHistory,
        currentStatus: 0
      }
    });

    return {
      currentCount: 0,
      currentDate: today,
      history: updatedHistory.slice(-7),
      currentStatus: 0
    };
  }
};

