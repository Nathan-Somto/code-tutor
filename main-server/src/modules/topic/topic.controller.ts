import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { BadRequestError } from "../../errors/httpErrors";
import { ResponseHandler } from "../../utils/responseHandler";
import { canEditCourse } from "../../utils/canEditCourse";
const createTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user?.profileId;
    const { name, description } = req.body;
    if(typeof name !== 'string'  ||  typeof description !== 'string'){
        throw new BadRequestError('name and description must be strings')
    }
    // check if course exists
    // check if teacher is a contributor
    // check if teacher is  a creator or contributor
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
    // what if it is the first topic
    // the order is 1 based
   let lastTopicOrder = course.Topic.length + 1
    const topic = await prisma.topic.create({
      data: {
        name,
        description,
        order: lastTopicOrder,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
    const response = {
        topic,
        courseId
    }
    ResponseHandler.send(res, 200, response, 'succesfully created topic!')
  } catch (err) {
    next(err);
  }
};
const changeTopicOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId, topicId } = req.params;
    const teacherId = req.user?.profileId;
    const { order } = req.body;

    // Check if the course exists and if the teacher can edit the course
    await canEditCourse(courseId, teacherId ?? "");

    // Check if the topic exists
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        courseId,
      },
    });

    if (!topic) {
      throw new BadRequestError("Topic does not exist");
    }

    // Check if order is a number
    if (typeof order !== "number") {
      throw new BadRequestError("Order must be a number");
    }

    // Get all topics for the course
    const topics = await prisma.topic.findMany({
      where: {
        courseId,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Check if order is between 1 and the number of topics
    if (order < 1 || order > topics.length) {
      throw new BadRequestError(`Order must be between 1 and ${topics.length}`);
    }

    // Find the topic that currently has the desired order
    const topicWithDesiredOrder = topics.find((t) => t.order === order);

    // If such a topic exists, update its order to the current topic's order
    if (topicWithDesiredOrder) {
      await prisma.topic.update({
        where: {
          id: topicWithDesiredOrder.id,
        },
        data: {
          order: topic.order,
        },
      });
    }

    // Update the order of the current topic
    const updatedTopic = await prisma.topic.update({
      where: {
        id: topicId,
      },
      data: {
        order,
      },
    });

    ResponseHandler.send(res, 200, updatedTopic, "Successfully changed order");
  } catch (err) {
    next(err);
  }
};

export { createTopic, changeTopicOrder };
