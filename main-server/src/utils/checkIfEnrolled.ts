import { prisma } from "../config/db";
import { BadRequestError } from "../errors/httpErrors";

export const checkIfEnrolled = async (courseId: string, studentId: string) => {
    const course =  await prisma.course.findFirst({
        where: {
          id: courseId,
          enrolledStudents: {
            some: {
              id: studentId
            }
          }
        }
      })
      if(!course) {
        throw new BadRequestError("You are not enrolled in this course");
      }
      return course;
}