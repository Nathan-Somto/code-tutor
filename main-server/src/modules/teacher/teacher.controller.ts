import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { ResponseHandler } from "../../utils/responseHandler";
const getTeacherDashboardInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get profile id from request
    const { teacherId } = req.params;
    // get teacher dashboard info
    // count the total number of students
    const studentsCount = await prisma.student.count();
    // count the total number of courses
    const coursesCount = await prisma.course.count();
    // get the courses that the teacher is a contributor or owner of calculate the total number of levels, it has , the total number of topics.
    const teacherCourses = await prisma.course.findMany({
      where: {
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
      select:{
        id: true,
        title: true,
        Topic: {
            select:{
                id: true,
                Level: {
                    select:{
                        id: true
                }
            }
        }
      }
    } });
    const dashboardInfo = {
        studentsCount,
        coursesCount,
        teacherCourses: teacherCourses.map((course) => {
            return {
                id: course.id,
                title: course.title,
                levelsCount: course.Topic.reduce((acc, topic) => acc + topic.Level.length, 0),
                topicsCount: course.Topic.length,
            };
        }),
    }
    ResponseHandler.send(res,200, dashboardInfo, 'retrieved teacher dashboard info')
  } catch (err) {
    next(err);
  }
};
export { getTeacherDashboardInfo};
