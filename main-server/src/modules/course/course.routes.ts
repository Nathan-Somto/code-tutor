import express from "express";
import { createcourse, getCourse, getCurriculum, getEnrolledStudents, joinAsContributor } from "./course.controller";
import topicRouter from "../topic";
import { teacherMiddleware } from "../../middleware/teacher.middleware";
import { auth } from "../../middleware/auth.middleware";
const router = express.Router();
router.use('/:courseId/topics', topicRouter);
// student ui
router.use(auth);
router.get('/:courseId/curriculum', getCurriculum);
router.use(teacherMiddleware);
// teacher ui
router.get('/:courseId', getCourse);
router.get('/:courseId/enrolled-students', getEnrolledStudents);
router.post("/:courseId/contributors",joinAsContributor);
router.post("/", createcourse);
export default router;
