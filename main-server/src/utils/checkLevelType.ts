import { LevelType } from "@prisma/client";
import { prisma } from "../config/db";
import { BadRequestError } from "../errors/httpErrors";

export const checkLevelType = async(levelId: string, levelType:LevelType) => {
const level = await prisma.level.findFirst({
    where: {
        id: levelId,
        levelType: levelType
    }
})
if(!level){
    throw new BadRequestError("Invalid level type");
}
return level;
}