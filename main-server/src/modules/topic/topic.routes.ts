import express from "express";
import { createTopic, changeTopicOrder } from "./topic.controller";
import levelsRouter from "../level";
import { auth } from "../../middleware/auth.middleware";
import { teacherMiddleware } from "../../middleware/teacher.middleware";
const router = express.Router();
router.use('/:topicId/levels', levelsRouter);
// teacher ui
router.use(auth);
router.use(teacherMiddleware);
router.post("/", createTopic);
router.patch("/:topicId/order", changeTopicOrder);
export default router;
