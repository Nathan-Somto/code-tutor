import express from "express";
import {
  completeLevel,
  enrollInCourse,
  freezeStreaks,
  getCourses,
  getBadgeProgress,
  getStudentProgress,
  getStreaks,
  getCourseProgress,
  saveCodeSolution,
  getLevelProgress,
  getLeaderboard,
  getLeaderboardPosition,
  getProfile,
  getStudents
} from "./student.controller";
import {auth} from "../../middleware/auth.middleware";
import { teacherMiddleware } from "../../middleware/teacher.middleware";
const router = express.Router();
router.use(auth);
// Student Progress (general app) i.e totalXp, rank, streak data., gems
router.get("/:studentId/student-progress", getStudentProgress);
// Streak Specific
router.get("/:studentId/streaks", getStreaks);
router.patch("/:studentId/freeze-streaks", freezeStreaks);
// Profile Page Specific stuff i.e student's ui.
router.get("/:studentId/profile", getProfile) 
/**@Todo implement endpoint below */
/* .patch("/:studentId/profile") */;
// gets the courses to be displayed on the Courses page of student ui
router.get("/:studentId/courses", getCourses);
// Course Progress Specific i.e for learn page(get)
router.get("/:studentId/course-progress/:courseId", getCourseProgress);
router.get("/:studentId/level-progress/:levelId", getLevelProgress);
// Enroll in a Course
router.post("/:studentId/courses/enroll", enrollInCourse);
router.get("/:studentId/badge-progress", getBadgeProgress);
// Route for getting the result of completing a level i.e achieved a streak or unlocked a badge, achieved new rank, total xp to be added to progress and unlocking a new level,
router.post("/:studentId/complete-level", completeLevel);
router.post("/:studentId/save-code", saveCodeSolution);
/* .patch("/:studentId/save-code"); */
// LeaderBoard Specific i.e leaderboard page in student ui.
router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard-position", getLeaderboardPosition);

router.use(teacherMiddleware);
router.get('/', getStudents);
export default router;
