import { Request, Response, NextFunction } from "express";
import { canEditCourse } from "../../utils/canEditCourse";
import { zodValidator } from "../../utils/zodValidator";
import {
  createQuizLevelSchema,
  CreateLessonLevelSchema,
  CreateCodeChallengeSchema,
  createLevelSchema,
} from "./level.schema";
import { prisma } from "../../config/db";
import { ResponseHandler } from "../../utils/responseHandler";
import { checkLevelType } from "../../utils/checkLevelType";
import { BadRequestError } from "../../errors/httpErrors";
import { checkIfEnrolled } from "../../utils/checkIfEnrolled";
import { $Enums } from "@prisma/client";
const createQuizlevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const profileId = req.user?.profileId;
    const course = canEditCourse(courseId, profileId ?? "");
    const body = req.body;
    const { answer, options, quizType, question, levelId } = zodValidator(
      createQuizLevelSchema,
      body
    );
    await checkLevelType(levelId, "Quiz");
    const quiz = await prisma.quizChallenge.create({
      data: {
        answer,
        options,
        question,
        quizType,
        level: {
          connect: { id: levelId },
        },
      },
    });
    ResponseHandler.send(res, 201, quiz, "succesfully created quiz");
  } catch (err) {
    next(err);
  }
};
const createCodeLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const profileId = req.user?.profileId;
    const course = canEditCourse(courseId, profileId ?? "");
    const body = req.body;
    const {
      challengeType,
      levelId,
      language,
      starterCode,
      starterFile,
      testCases,
    } = zodValidator(CreateCodeChallengeSchema, body);
    await checkLevelType(levelId, "Code");
    const newCodeChallenge = await prisma.codeChallenge.create({
      data: {
        challengeType,
        language,
        starterFile,
        starterCode,
        level: {
          connect: { id: levelId },
        },
      },
    });

    // Create test cases associated with the new code challenge
    await prisma.testCase.createMany({
      data: testCases.map((testCase) => ({
        codeChallengeId: newCodeChallenge.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        description: testCase.description,
      })),
    });
    ResponseHandler.send(
      res,
      201,
      { codeChalenge: newCodeChallenge, levelId, courseId },
      "Code challenge created successfully"
    );
  } catch (err) {
    next(err);
  }
};
const createLessonLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const profileId = req.user?.profileId;
    const course = canEditCourse(courseId, profileId ?? "");
    const body = req.body;
    const { content, levelId } = zodValidator(CreateLessonLevelSchema, body);
    await checkLevelType(levelId, "Lesson");
    const lesson = await prisma.lesson.create({
      data: {
        content,
        level: {
          connect: { id: levelId },
        },
      },
    });
    ResponseHandler.send(
      res,
      200,
      { lesson, levelId, courseId },
      "created lesson level"
    );
  } catch (err) {
    next(err);
  }
};

const getLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    type GetLevelQuery = {
      levelType: $Enums.LevelType;
    };
    const { courseId, levelId } = req.params;
    const studentId = req.user?.profileId;
    const { levelType = "Quiz" } = req.query as GetLevelQuery;
    // check if student is enrolled in the course
    const course = await checkIfEnrolled(courseId, studentId ?? "");
    // get the level, based on the levelType select what to populate
    const select = {
      QuizChallenge: levelType === "Quiz" ? true : undefined,
      Lesson: levelType === "Lesson" ? true : undefined,
      codeChallenge:
        levelType === "Code" ? { select: { testCases: true } } : undefined,
    };

    let level = await prisma.level.findFirst({
      where: {
        id: levelId,
      },
      select: {
        xp: true,
        gems: true,
        id: true,
        difficulty: true,
        name: true,
        ...select,
      },
    });
  } catch (err) {
    next(err);
  }
};
const getCodeSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId, levelId } = req.params;
    const studentId = req.user?.profileId;
    // check if student is enrolled in course
    await checkIfEnrolled(courseId, studentId ?? "");
    // check if student has completed the level
    const levelProgress = await prisma.levelProgress.findFirst({
      where: {
        levelId,
        studentId,
      },
    });
    // check if student has completed the level.
    if (!levelProgress) {
      throw new BadRequestError("You have not completed this level");
    }
    // get all code submissions for the level
    const codeSubmissions = await prisma.level.findFirst({
      where: {
        id: levelId,
      },
      select: {
        codeChallenge: {
          select: {
            starterFile: true,
            id: true,
            solution: {
              select: {
                answer: true,
                owner: {
                  select: {
                    username: true,
                    id: true,
                    user: {
                      select: {
                        profile_photo: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    // normalize the data
    /* 
      {
        id: "",
        description: "",
        submissions: [
          {
            id: 1,
            avatar: "https://",
            username: "username",
            code: "code"
          }
        ]
      */
    let normalizedData = {
      id: "",
      description: "",
      submissions: [{ id: "", avatar: "", username: "", code: "" }],
    };
    if (codeSubmissions !== null && codeSubmissions?.codeChallenge !== null) {
      normalizedData.description = codeSubmissions.codeChallenge.starterFile;
      normalizedData.id = codeSubmissions.codeChallenge.id;
      normalizedData.submissions.pop();
      normalizedData.submissions = codeSubmissions.codeChallenge.solution.map(
        (curr) => ({
          id: curr.owner.id,
          avatar: curr.owner.user.profile_photo ?? "",
          username: curr.owner.username,
          code: curr.answer,
        })
      );
    }
    ResponseHandler.send(res, 200, normalizedData, "Code Submissions");
  } catch (err) {
    next(err);
  }
};
const createLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const profileId = req.user?.profileId;
    const course = canEditCourse(courseId, profileId ?? "");
    const body = req.body;
    const { topicId, gems, levelType, xp, mysteryLevel, order, difficulty, name } =
      zodValidator(createLevelSchema, body);
    const newLevel = await prisma.level.create({
      data: {
        topicId,
        gems,
        levelType,
        xp,
        mysteryLevel,
        order,
        difficulty,
        name
      },
    });
    ResponseHandler.send(res, 201, newLevel, "Level created successfully");
  } catch (err) {
    next(err);
  }
};
const getLevels = async (req: Request, res: Response, next: NextFunction) => {
  //levels under a course and topic
  try {
    const { courseId, topicId } = req.params;
    const profileId = req.user?.profileId;
    const course = canEditCourse(courseId, profileId ?? "");
    const levels = await prisma.level.findMany({
      where: {
        topicId,
      },
      select: {
        order: true,
        id: true,
        difficulty: true,
        levelType: true,
        name: true
      },
    });
    ResponseHandler.send(res, 200, levels, "Levels retrieved successfully");
  } catch (err) {
    next(err);
  }
};
const getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, levelId } = req.params;
    const profileId = req.user?.profileId;
    const course = canEditCourse(courseId, profileId ?? "");
    const quizzes = await prisma.quizChallenge.findMany({
      where: {
        levelId,
      },
    });
    ResponseHandler.send(res, 200, quizzes, "Quizzes retrieved successfully");
  } catch (err) {
    next(err);
  }
};
export {
  createQuizlevel,
  createLevel,
  createCodeLevel,
  createLessonLevel,
  getLevel,
  getLevels,
  getCodeSubmissions,
  getQuizzes,
};
