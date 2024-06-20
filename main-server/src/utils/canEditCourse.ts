import { prisma } from "../config/db";
import { BadRequestError } from "../errors/httpErrors";

export const canEditCourse = async (courseId: string, teacherId: string) => {
    const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          OR: [
            {
              creatorId: teacherId,
            },
            {
              contributors: {
                some: {
                  id: teacherId,
                },
              },
            },
          ],
        },
        select : {
          Topic: {
              select: {
                  id: true,
              },
              },
          }
        }
      );
      if(!course){
          throw new BadRequestError('course does not exist or you are not a contributor')
      }
      return course;
}