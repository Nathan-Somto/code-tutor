import express from "express";
import { getTeacherDashboardInfo } from "./teacher.controller";
import { auth } from "../../middleware/auth.middleware";
import { teacherMiddleware } from "../../middleware/teacher.middleware";
const router = express.Router();
router.use(auth);
router.use(teacherMiddleware);
router.get("/:teacherId/dashboard", getTeacherDashboardInfo);
export default router;
