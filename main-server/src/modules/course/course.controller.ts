import { NextFunction, Request, Response } from "express";
import courseSchema from "./course.schema";
import { zodValidator } from "../../utils/zodValidator";
import { prisma } from "../../config/db";
import { ResponseHandler } from "../../utils/responseHandler";
import { BadRequestError } from "../../errors/httpErrors";
const createcourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate data
    const {
      contributorIds,
      creatorId,
      description,
      language,
      title,
      image_url,
    } = req.body as courseSchema;
    const validatedData = zodValidator(courseSchema, {
      contributorIds,
      creatorId,
      description,
      language,
      title,
      image_url,
    });
    const newCourse = await prisma.course.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        image_url: validatedData.image_url,
        creatorId: validatedData.creatorId,
        language: validatedData.language,
        contributors: {
          connect: validatedData.contributorIds.map((id: string) => ({ id })),
        },
      },
    });
    ResponseHandler.send(res, 201, newCourse, "successfully created course");
  } catch (err) {
    next(err);
  }
};
const getCurriculum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const profileId = req.user?.profileId;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    // Check if the student is enrolled in the course and get the topics
    const studentEnrolled = await prisma.student.findFirst({
      where: {
        id: profileId as string,
        enrolledCourses: {
          some: {
            id: courseId,
          },
        },
      },
    });

    if (!studentEnrolled) {
      throw new BadRequestError("Student is not enrolled in this course");
    }

    // Get the topics with pagination and only the specified properties
    const topics = await prisma.topic.findMany({
      where: { courseId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        xpPointsNeeded: true,
        name: true,
        description: true,
        Level: {
          select: {
            id: true,
            xp: true,
            mysteryLevel: true,
            difficulty: true,
            levelType: true,
          },
        },
      },
    });

    // Return the data
    const data = {
      courseId,
      topics,
      topics_pagination: {
        currentPage: page,
        pageSize,
      },
    };
    ResponseHandler.send(res, 200, data, "successfully retrieved curriculum");
  } catch (err) {
    next(err);
  }
};

const getEnrolledStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if the teacher is a contributor or the creator of the course
    const { courseId } = req.params;
    const teacherId = req.user?.profileId;
    // paginate the students  data
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
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
    });
    if (!course) {
      throw new BadRequestError("You are not allowed to view this course");
    }
    // get the enrolled students
    // Fetch the students with related data
    const students = await prisma.student.findMany({
      where: {
        enrolledCourses: {
          some: {
            id: courseId,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        xpPoints: true,
        // Include the name, profile_photo of the user connected to this student
        user: {
          select: {
            name: true,
            profile_photo: true,
          },
        },
        // Include solutions to calculate total code submissions
        solutions: {
          select: {
            id: true,
          },
          where: {
            courseId,
          },
        },
        // For the course they are enrolled in, get the current level which is in their course progress
        courseProgress: {
          select: {
            currentLevel: true,
            currentTopic: {
              select: {
                Level: true,
                order: true,
              },
            },
          },
          where: {
            courseId,
          },
        },
      },
    });

    // Calculate the required data for each student
    const studentData = students.map((student) => {
      const { id, username, xpPoints, user, courseProgress, solutions } =
        student;
      let currentLevel = 0;

      if (courseProgress.length > 0) {
        const progress = courseProgress[0];
        const topic = progress.currentTopic;
        const level = topic.Level.find(
          (level) => level.id === progress?.currentLevel?.id
        );

        if (level) {
          const levelIndex = topic.Level.indexOf(level);
          currentLevel = topic.order * (levelIndex + 1);
        }
      }

      return {
        profile_photo: user.profile_photo,
        id,
        name: user.name,
        username,
        currentLevel,
        xp: xpPoints,
        totalCodeSubmissions: solutions.length,
      };
    });
    ResponseHandler.send(
      res,
      200,
      { studentData, page, pageSize },
      "successfully retrieved enrolled students"
    );
  } catch (err) {
    next(err);
  }
};
const joinAsContributor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const { contributorId } = req.body;
    const teacherId = req.user?.profileId;

    // Check if the teacher is a contributor or the creator of the course
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
    });

    if (course) {
      throw new BadRequestError(
        "You cannot be added as a contributor to this course"
      );
    }

    // Add the contributor to the course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        contributors: {
          connect: {
            id: contributorId,
          },
        },
      },
    });

    ResponseHandler.send(
      res,
      200,
      updatedCourse,
      "successfully added as a contributor to course"
    );
  } catch (err) {
    next(err);
  }
};
const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user?.profileId;
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
      select: {
        image_url: true,
        title: true,
        id: true,
        Topic: {
          select: {
            order: true,
            name: true,
            description: true,
            id: true,
          },
        },
        contributors: {
          select: {
            user: {
              select: {
                profile_photo: true,
                name: true,
              },
            },
          },
        },
        creator: {
          select: {
            user: {
              select: {
                profile_photo: true,
                name: true,
              },
            },
          },
        },
        enrolledStudentsId: true,
      },
    });
    if (!course) {
      throw new BadRequestError("teacher does not have access to this course.");
    }
    course.contributors.unshift(course.creator);
    ResponseHandler.send(
      res,
      200,
      {
        ...course,
        enrolledStudentsId: undefined,
        creator: undefined,
        totlaEnrolledStudents: course.enrolledStudentsId.length,
      },
      "succesfully retrieved course information"
    );
  } catch (err) {
    next(err);
  }
};
export {
  createcourse,
  getCurriculum,
  getEnrolledStudents,
  joinAsContributor,
  getCourse,
};
