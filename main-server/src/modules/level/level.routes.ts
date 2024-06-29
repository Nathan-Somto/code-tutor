import express from "express";
import { createCodeLevel, createQuizlevel, getLevel, createLessonLevel, getLevels, getCodeSubmissions, createLevel, getQuizzes } from "./level.controller";
import { teacherMiddleware } from "../../middleware/teacher.middleware";
import { auth } from "../../middleware/auth.middleware";

const router = express.Router();
// student ui
router.use(auth);
router.get('/:levelId/code-submissions', getCodeSubmissions);
// teacher ui
router.use(teacherMiddleware);
router.post('/', createLevel).get('/', getLevels);
router.post("/quiz", createQuizlevel);
router.post("/lesson", createLessonLevel);
router.post("/code", createCodeLevel);
router.get("/quiz", getQuizzes);
export default router;
