import { $Enums, Difficulty } from "@prisma/client";
import { prisma } from "../config/db";
type Count = {
    EasyCount: number;
    MediumCount: number;
    HardCount: number;
    AdvancedCount: number;
    ExpertCount: number;
  };
const getCurrentRank = ({
    EasyCount,
    MediumCount,
    HardCount,
    AdvancedCount,
    ExpertCount,
  }: Count) => {
    if (EasyCount === 10 || MediumCount === 5) {
      return Difficulty.Medium;
    }
    if (MediumCount === 20 || HardCount === 5) {
      return Difficulty.Hard;
    }
    if (HardCount === 15 || AdvancedCount === 7) {
      return Difficulty.Advanced;
    }
    if (AdvancedCount === 12 || ExpertCount === 3) {
      return Difficulty.Expert;
    }
    return Difficulty.Easy;
  };
export const updateRankProgress = async(id: string,  rank: $Enums.Difficulty, studentId: string) => {
    const rankProgress = await prisma.rankProgress.update({
        where: {
          id,
        },
        data: {
          [`${rank}Count`]: {
            increment: 1,
          },
        },
        select: {
          EasyCount: true,
          MediumCount: true,
          AdvancedCount: true,
          HardCount: true,
          ExpertCount: true,
          id: false,
        },
      });
      // get current rank from update
      const currentRank = getCurrentRank(rankProgress);
      // check if the user has achieved a new rank if so update, add to result data.
      if (rank !== currentRank) {
        await prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            rank: currentRank,
          },
        });
        return currentRank;
      }
}