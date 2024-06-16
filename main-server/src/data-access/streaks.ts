import {prisma} from "../config/db"
import { BadRequestError } from "../errors/httpErrors";
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
  if(!streak) {
    return {
      history: [],
      currentStatus: 0,
      currentDate: new Date(),
      currentCount: 0
    }
  }
  const today = new Date();
  const currentDate = streak.createdDate;
  const diff = getDayDifference(currentDate, today)
  // if current date is today send back the  current data.
  if( diff === 0){
    return {
      history: streak.history.slice(-7),
      currentStatus: streak.currentStatus,
      currentDate,
      currentCount: streak.currentCount
    }
  }
  else {
    // update all the missed days to 0
    const updatedHistory = [...streak.history];
    for (let i = 0; i < diff; i++){
      updatedHistory.push(0)
    };
    await prisma.streaks.update({
      where: {
        id: streak.id
      },
      data : {
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
    }
  }
}
