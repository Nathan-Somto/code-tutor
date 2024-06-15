import express from "express";
import {completeLevel} from './student.controller'
const router = express.Router();
// Student Progress (general app) i.e totalXp, hints Used, rank, streak data.
router.get('/:studentId/student-progress')
// Streak Specific
router.get("/:studentId/streaks");
router.patch("/:studentId/freeze-streaks");
// Profile Page Specific stuff i.e student's ui.
router.get("/:studentId/profile").patch("/:studentId/profile");
// gets the courses to be displayed on the Courses page of student ui
router.get("/:studentId/courses");
// Course Progress Specific i.e for learn page(get), complete a level, finish a topic.(patch)
router
  .get("/:studentId/course-progress/:courseId")
router
  .get("/:studentId/level-progress/:levelId")
// Enroll in a Course  
router.post("/:studentId/courses/:courseId/enroll");
// Route for getting the result of completing a level i.e achieved a streak or unlocked a badge, achieved new rank, total xp to be added to progress and unlocking a new level,
router.post('/:studentId/complete-level', completeLevel);
router
  .post("/:studentId/:levelId/submit-code")
  .patch("/:studentId/:levelId/submit-code");
// LeaderBoard Specific i.e leaderboard page in student ui.
router.get("/leaderboard");
router.get("/:studentId/leaderboard-position");

export default router;
